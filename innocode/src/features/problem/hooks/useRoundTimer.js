import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook để tính time remaining cho round
 * Timer đếm ngược từ khi user vào page lần đầu (sessionStartTime) + timeLimitSeconds
 * KHÔNG dựa vào round.start, chỉ tính từ thời điểm user bắt đầu làm bài
 * @param {Object} round - Round object với roundId, timeLimitSeconds
 * @param {Function} onExpired - Callback khi hết thời gian
 * @returns {object} - { timeRemaining, formatTime, isExpired }
 */
export const useRoundTimer = (round, onExpired = null) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const hasExpiredRef = useRef(false);
  const sessionStartTimeRef = useRef(null);
  const initializedRef = useRef(false);

  // Khởi tạo session start time khi round được load lần đầu
  // Reset khi roundId thay đổi
  useEffect(() => {
    if (!round?.roundId || !round?.timeLimitSeconds) {
      sessionStartTimeRef.current = null;
      initializedRef.current = false;
      return;
    }

    const storageKey = `round_timer_start_${round.roundId}`;
    const currentRoundId = initializedRef.current ? sessionStorage.getItem(`round_timer_current_roundId`) : null;
    
    // Reset nếu roundId thay đổi
    if (currentRoundId && currentRoundId !== round.roundId) {
      sessionStartTimeRef.current = null;
      initializedRef.current = false;
      // Xóa old storage
      const oldStorageKey = `round_timer_start_${currentRoundId}`;
      sessionStorage.removeItem(oldStorageKey);
      sessionStorage.removeItem(`round_timer_current_roundId`);
    }

    // Chỉ khởi tạo một lần cho mỗi roundId
    if (!initializedRef.current) {
      const savedStartTime = sessionStorage.getItem(storageKey);
      
      if (savedStartTime) {
        // Đã có start time trong session - restore lại
        sessionStartTimeRef.current = new Date(savedStartTime);
        console.log("🕐 Restored timer start time from session:", sessionStartTimeRef.current, "for round:", round.roundId);
      } else {
        // Lần đầu vào page cho round này - tạo start time mới (NOW)
        sessionStartTimeRef.current = new Date();
        sessionStorage.setItem(storageKey, sessionStartTimeRef.current.toISOString());
        sessionStorage.setItem(`round_timer_current_roundId`, round.roundId);
        console.log("🆕 Created new timer start time:", sessionStartTimeRef.current, "for round:", round.roundId, "timeLimit:", round.timeLimitSeconds, "s");
      }
      initializedRef.current = true;
    }
  }, [round?.roundId, round?.timeLimitSeconds]);

  const calculateTimeRemaining = useCallback(() => {
    if (!round?.timeLimitSeconds || !sessionStartTimeRef.current) return null;

    const now = new Date();
    const startTime = sessionStartTimeRef.current;
    const elapsed = Math.floor((now - startTime) / 1000); // seconds
    const remaining = round.timeLimitSeconds - elapsed;

    return remaining > 0 ? remaining : 0;
  }, [round?.timeLimitSeconds]);

  useEffect(() => {
    if (!round?.timeLimitSeconds || !sessionStartTimeRef.current) {
      setTimeRemaining(null);
      hasExpiredRef.current = false;
      return;
    }

    const updateTime = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Auto submit when expired (only once)
      if (remaining <= 0 && !hasExpiredRef.current && onExpired) {
        hasExpiredRef.current = true;
        onExpired();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [round?.timeLimitSeconds, calculateTimeRemaining, onExpired]);

  const formatTime = useCallback((seconds) => {
    if (seconds === null || seconds === undefined) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    timeRemaining,
    formatTime,
    isExpired: timeRemaining !== null && timeRemaining <= 0,
  };
};

