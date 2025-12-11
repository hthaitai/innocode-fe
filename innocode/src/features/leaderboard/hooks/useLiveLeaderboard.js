import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

const HUB_URL = "https://innocode-challenge-api.onrender.com/hubs/leaderboard";

/**
 * Custom hook for live leaderboard updates via SignalR
 * @param {string} contestId - The contest ID to subscribe to
 * @param {function} onUpdate - Callback function when leaderboard updates
 * @param {boolean} enabled - Whether to enable the connection (default: true)
 */
export const useLiveLeaderboard = (contestId, onUpdate, enabled = true) => {
  const connectionRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000; // 3 seconds

  const connect = useCallback(() => {
    if (!contestId || !enabled) {
      return;
    }

    // Clean up existing connection
    if (connectionRef.current) {
      connectionRef.current.stop();
      connectionRef.current = null;
    }

    // Get token for authentication
    const token = localStorage.getItem("token");

    // Create connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token || "",
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 2s, 4s, 8s, 16s, max 30s
          const delay = Math.min(2000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          return delay;
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Connection event handlers
    connection.onclose((error) => {
      setIsConnected(false);
      if (error) {
        console.error("SignalR connection closed with error:", error);
        setConnectionError(error.message || "Connection closed");
        
        // Manual reconnection if automatic reconnect fails
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        } else {
          setConnectionError("Failed to reconnect after multiple attempts");
        }
      } else {
        setConnectionError(null);
      }
    });

    connection.onreconnecting((error) => {
      setIsConnected(false);
      if (error) {
        console.warn("SignalR reconnecting...", error);
      }
    });

    connection.onreconnected((connectionId) => {
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;
      console.log("SignalR reconnected:", connectionId);
      
      // Re-subscribe to contest updates after reconnection
      if (contestId) {
        connection.invoke("JoinContestGroup", contestId)
          .catch(() => connection.invoke("SubscribeToContest", contestId))
          .catch(() => connection.invoke("JoinGroup", contestId))
          .catch(() => connection.invoke("Subscribe", contestId))
          .catch((err) => {
            if (import.meta.env.VITE_ENV === "development") {
              console.warn("Could not rejoin contest group after reconnection:", err);
            }
          });
      }
    });

    // Listen for leaderboard updates
    connection.on("UpdateLeaderboard", (data) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("📊 Live leaderboard update received:", data);
      }
      
      if (onUpdate && typeof onUpdate === "function") {
        try {
          onUpdate(data);
        } catch (error) {
          console.error("Error in onUpdate callback:", error);
        }
      }
    });

    // Start connection
    connection
      .start()
      .then(() => {
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        console.log("SignalR connected to leaderboard hub");

        // Join the contest group
        // Note: The method name may vary depending on the backend implementation
        // Common names: JoinContestGroup, SubscribeToContest, JoinGroup, Subscribe
        if (contestId) {
          return connection.invoke("JoinContestGroup", contestId).catch((err) => {
            // If JoinContestGroup doesn't exist, try alternative methods
            if (import.meta.env.VITE_ENV === "development") {
              console.warn("JoinContestGroup method not found, trying alternatives...", err);
            }
            
            // Try alternative method names
            return connection.invoke("SubscribeToContest", contestId)
              .catch(() => connection.invoke("JoinGroup", contestId))
              .catch(() => connection.invoke("Subscribe", contestId))
              .catch((finalErr) => {
                // If all methods fail, connection still works for broadcasts
                if (import.meta.env.VITE_ENV === "development") {
                  console.warn("Could not join contest group, but connection is active:", finalErr);
                }
                return Promise.resolve();
              });
          });
        }
      })
      .then(() => {
        if (import.meta.env.VITE_ENV === "development") {
          console.log(`Subscribed to contest ${contestId} leaderboard updates`);
        }
      })
      .catch((error) => {
        console.error("SignalR connection error:", error);
        setConnectionError(error.message || "Failed to connect");
        setIsConnected(false);
      });

    connectionRef.current = connection;
  }, [contestId, onUpdate, enabled]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (connectionRef.current) {
      connectionRef.current
        .stop()
        .then(() => {
          console.log("SignalR disconnected");
          setIsConnected(false);
        })
        .catch((error) => {
          console.error("Error disconnecting SignalR:", error);
        });
      connectionRef.current = null;
    }
  }, []);

  // Effect to manage connection lifecycle
  useEffect(() => {
    if (enabled && contestId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [contestId, enabled, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionError,
    reconnect: connect,
    disconnect,
  };
};

