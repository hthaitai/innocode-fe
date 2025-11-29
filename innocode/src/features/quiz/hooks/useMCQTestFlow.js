import { useState, useEffect, useCallback, useRef } from "react";
import quizApi from "@/api/quizApi";

const useMCQTestFlow = (roundId) => {
  const [testKey, setTestKey] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLimitInSeconds, setTimeLimitInSeconds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Initialize test - get start detail
  const initializeTest = useCallback(async () => {
    if (!roundId) return null;

    try {
      setLoading(true);
      setError(null);

      // CRITICAL SECURITY: Only check testKey in sessionStorage
      // If testKey exists, ALWAYS use it - NEVER create new test
      // Use startTime from sessionStorage to preserve time remaining on refresh
      const savedKey = sessionStorage.getItem(`mcq_test_key_${roundId}`);

      if (savedKey) {
        // Test already exists - restore from server for timeLimit, use sessionStorage for startTime
        console.log(
          "🔒 Existing test found, validating with server..."
        );

        setTestKey(savedKey);

        try {
          // Get timeLimit from server (prevents cheating)
          const currentAnswerResponse = await quizApi.getCurrentAnswer(
            roundId,
            savedKey
          );

          if (
            currentAnswerResponse.data?.code === "SUCCESS" &&
            currentAnswerResponse.data?.data
          ) {
            const serverData = currentAnswerResponse.data.data;
            const serverTimeLimit = serverData.timeLimitSeconds;

            // ALWAYS use server value for timeLimit (prevents cheat)
            setTimeLimitInSeconds(serverTimeLimit);
            console.log("🔒 TimeLimit from server:", serverTimeLimit);

            // CRITICAL: Use startTime from sessionStorage to preserve time remaining
            // Don't call getStartDetail - it might return new startTime and reset timer
            const savedStartTime = sessionStorage.getItem(`mcq_test_startTime_${roundId}`);
            
            if (savedStartTime) {
              const restoredStartTime = new Date(savedStartTime);
              
              // Validate startTime: should not be in future
              const now = new Date();
              if (restoredStartTime <= now) {
                setStartTime(restoredStartTime);
                console.log("🔒 Using startTime from sessionStorage (preserves time remaining):", restoredStartTime);
                
                // Update sessionStorage with server timeLimit only (don't overwrite startTime)
                sessionStorage.setItem(`mcq_test_key_${roundId}`, savedKey);
                sessionStorage.setItem(`mcq_test_timeLimit_${roundId}`, serverTimeLimit.toString());
                // Keep startTime as is - preserves time remaining on refresh
                
                setLoading(false);
                return {
                  key: savedKey,
                  startTime: restoredStartTime, // From sessionStorage - preserves time
                  timeLimitInSeconds: serverTimeLimit, // From server - prevents cheat
                };
              } else {
                console.warn("⚠️ Invalid startTime (in future):", restoredStartTime);
              }
            } else {
              console.warn("⚠️ StartTime not found in sessionStorage");
            }
            
            // Fallback: If startTime is missing or invalid, cannot restore test
            console.error("❌ Cannot restore test: startTime is missing or invalid");
            setError("Test session corrupted. Please start a new test.");
            setLoading(false);
            return null;
          }
        } catch (validateError) {
          console.error("❌ Failed to validate with server:", validateError);
          setError("Failed to validate test session. Please refresh the page.");
          setLoading(false);
          return null;
        }
      }

      // Call API to get start detail (create new test if first time)
      const response = await quizApi.getStartDetail(roundId);

      if (response.data?.code === "SUCCESS" && response.data?.data) {
        const {
          key,
          startTime: apiStartTime,
          timeLimitInSeconds: apiTimeLimit,
        } = response.data.data;

        const parsedStartTime = new Date(apiStartTime);

        setTestKey(key);
        setStartTime(parsedStartTime);
        setTimeLimitInSeconds(apiTimeLimit);

        // Save to sessionStorage
        sessionStorage.setItem(`mcq_test_key_${roundId}`, key);
        sessionStorage.setItem(`mcq_test_startTime_${roundId}`, apiStartTime);
        sessionStorage.setItem(
          `mcq_test_timeLimit_${roundId}`,
          apiTimeLimit.toString()
        );

        setLoading(false);
        return {
          key,
          startTime: parsedStartTime,
          timeLimitInSeconds: apiTimeLimit,
        };
      } else {
        throw new Error(response.data?.message || "Failed to initialize test");
      }
    } catch (err) {
      console.error("❌ Error initializing test:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to initialize test"
      );
      setLoading(false);
      return null;
    }
  }, [roundId]);

  // Save answer with debounce
  const saveAnswer = useCallback(
    async (answers) => {
      console.log("🔄 saveAnswer called (debounce)", {
        hasTestKey: !!testKey,
        hasRoundId: !!roundId,
        answersCount: answers?.length || 0,
        answers: answers,
      });

      if (!testKey || !roundId || !answers || answers.length === 0) {
        console.log("⏸️ saveAnswer skipped: Missing required params", {
          testKey: !!testKey,
          roundId: !!roundId,
          answersLength: answers?.length || 0,
        });
        return;
      }

      // Clear previous timeout
      if (saveTimeoutRef.current) {
        console.log("⏸️ Clearing previous save timeout");
        clearTimeout(saveTimeoutRef.current);
      }

      console.log("⏳ Setting debounce timeout (1s)...");
      // Debounce: save after 1 second of no changes
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          console.log("📤 Calling API saveAnswers...", {
            roundId,
            testKey,
            answers,
          });
          await quizApi.saveAnswers(roundId, testKey, answers);
          console.log("✅ Answers saved successfully (debounced)");
        } catch (err) {
          console.error("❌ Error saving answers (debounced):", err);
          console.error("❌ Error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        }
      }, 1000);
    },
    [roundId, testKey]
  );

  // Save answer immediately (no debounce) - for when user clicks Next/Previous
  const saveAnswerImmediate = useCallback(
    async (answers) => {
      console.log("⚡ saveAnswerImmediate called", {
        hasTestKey: !!testKey,
        hasRoundId: !!roundId,
        answersCount: answers?.length || 0,
        answers: answers,
      });

      if (!testKey || !roundId || !answers || answers.length === 0) {
        console.log("⏸️ saveAnswerImmediate skipped: Missing required params", {
          testKey: !!testKey,
          roundId: !!roundId,
          answersLength: answers?.length || 0,
        });
        return { success: false, error: "Missing required parameters" };
      }

      // Clear any pending debounced save
      if (saveTimeoutRef.current) {
        console.log("⏸️ Clearing pending debounced save");
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      // Save immediately
      try {
        console.log("📤 Calling API saveAnswers (immediate)...", {
          roundId,
          testKey,
          answers,
        });
        await quizApi.saveAnswers(roundId, testKey, answers);
        console.log("✅ Answers saved immediately");
        return { success: true };
      } catch (err) {
        console.error("❌ Error saving answers (immediate):", err);
        console.error("❌ Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config,
        });
        return {
          success: false,
          error: err.response?.data?.message || err.message,
        };
      }
    },
    [roundId, testKey]
  );

  // Get current answers (for refresh) - can accept optional testKey parameter
  const getCurrentAnswers = useCallback(
    async (optionalTestKey = null) => {
      const keyToUse = optionalTestKey || testKey;
      if (!keyToUse || !roundId) {
        console.log("⏸️ getCurrentAnswers skipped: Missing key or roundId", {
          keyToUse: !!keyToUse,
          roundId: !!roundId,
          testKey: !!testKey,
          optionalTestKey: !!optionalTestKey,
        });
        return null;
      }

      try {
        console.log("🔄 Fetching current answers...", { roundId, keyToUse });
        const response = await quizApi.getCurrentAnswer(roundId, keyToUse);
        console.log("📥 getCurrentAnswers API response:", response);

        if (response.data?.code === "SUCCESS" && response.data?.data) {
          const data = response.data.data;
          console.log("✅ getCurrentAnswers success:", data);

          // CRITICAL: Update timeLimit from server to prevent cheating
          // Server is the source of truth, not sessionStorage
          if (data.timeLimitSeconds) {
            console.log(
              "🔒 Updating timeLimit from server (prevent cheat):",
              data.timeLimitSeconds
            );
            setTimeLimitInSeconds(data.timeLimitSeconds);
            // Update sessionStorage with server value
            sessionStorage.setItem(
              `mcq_test_timeLimit_${roundId}`,
              data.timeLimitSeconds.toString()
            );
          }

          return data;
        }
        console.log("ℹ️ getCurrentAnswers: No data in response");
        return null;
      } catch (err) {
        console.error("❌ Error getting current answers:", err);
        console.error("❌ Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        return null;
      }
    },
    [roundId, testKey]
  );

  // Calculate time remaining
  const getTimeRemaining = useCallback(() => {
    if (!startTime || !timeLimitInSeconds) return null;

    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000); // seconds
    const remaining = timeLimitInSeconds - elapsed;

    return remaining > 0 ? remaining : 0;
  }, [startTime, timeLimitInSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    testKey,
    startTime,
    timeLimitInSeconds,
    loading,
    error,
    initializeTest,
    saveAnswer,
    saveAnswerImmediate,
    getCurrentAnswers,
    getTimeRemaining,
  };
};

export default useMCQTestFlow;
