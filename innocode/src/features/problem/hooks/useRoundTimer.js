import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook để tính time remaining cho round
 * Timer đếm ngược từ khi user vào page lần đầu (sessionStartTime) + timeLimitSeconds
 * KHÔNG dựa vào round.start, chỉ tính từ thời điểm user bắt đầu làm bài
 * @param {Object} round - Round object với roundId, timeLimitSeconds
 * @param {Function} onExpired - Callback khi hết thời gian
 * @returns {object} - { timeRemaining, formatTime, isExpired }
 */
const createTimerHash = (roundId, startTime) => {
  const secret = `timer_secret_${roundId}`;
  const data = `${roundId}_${startTime}_${secret}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const verifyTimerHash = (roundId, startTime, hash) => {
  const expectedHash = createTimerHash(roundId, startTime);
  return expectedHash === hash;
};

export const useRoundTimer = (round, onExpired = null) => {
  const { user } = useAuth();
  const userId = user?.id || sessionStorage.getItem('current_user_id') || 'anonymous';
  
  const [timeRemaining, setTimeRemaining] = useState(null);
  const hasExpiredRef = useRef(false);
  const sessionStartTimeRef = useRef(null);
  const initializedRef = useRef(false);
  // Lưu start time ban đầu để khôi phục khi phát hiện gian lận
  const originalStartTimeRef = useRef(null);

  // Khởi tạo session start time khi round được load lần đầu
  // Reset khi roundId thay đổi
  useEffect(() => {
    if (!round?.roundId || !round?.timeLimitSeconds) {
      sessionStartTimeRef.current = null;
      initializedRef.current = false;
      originalStartTimeRef.current = null;
      return;
    }

    // Include user ID in storage keys to prevent cross-user data leakage
    const storageKey = `round_timer_start_${userId}_${round.roundId}`;
    const hashKey = `round_timer_hash_${userId}_${round.roundId}`;
    const currentRoundIdKey = `round_timer_current_roundId_${userId}`;
    const currentRoundId = initializedRef.current
      ? sessionStorage.getItem(currentRoundIdKey)
      : null;

    // Reset nếu roundId thay đổi
    if (currentRoundId && currentRoundId !== round.roundId) {
      sessionStartTimeRef.current = null;
      initializedRef.current = false;
      originalStartTimeRef.current = null;
      // Xóa old storage
      const oldStorageKey = `round_timer_start_${userId}_${currentRoundId}`;
      const oldHashKey = `round_timer_hash_${userId}_${currentRoundId}`;
      sessionStorage.removeItem(oldStorageKey);
      sessionStorage.removeItem(oldHashKey);
      sessionStorage.removeItem(currentRoundIdKey);
    }

    if (!initializedRef.current) {
      const savedStartTime = sessionStorage.getItem(storageKey);
      const savedHash = sessionStorage.getItem(hashKey);

      if (savedStartTime && savedHash) {
        // Verify hash để đảm bảo không bị gian lận
        const isValid = verifyTimerHash(
          round.roundId,
          savedStartTime,
          savedHash
        );

        if (isValid) {
          const parsedStartTime = new Date(savedStartTime);
          const now = new Date();

          // Thêm validation: start time không thể lớn hơn hiện tại
          // và không thể quá xa trong quá khứ (ví dụ: không quá 24h trước)
          const maxPastTime = 24 * 60 * 60 * 1000; // 24 hours
          const timeDiff = now - parsedStartTime;

          if (parsedStartTime <= now && timeDiff <= maxPastTime) {
            // Đã có start time trong session - restore lại
            sessionStartTimeRef.current = parsedStartTime;
            // Lưu start time ban đầu để khôi phục khi phát hiện gian lận
            originalStartTimeRef.current = parsedStartTime;
            console.log(
              "🕐 Restored timer start time from session:",
              sessionStartTimeRef.current,
              "for round:",
              round.roundId
            );
          } else {
            // Start time không hợp lệ - KHÔNG reset, sử dụng thời gian hiện tại nhưng tính từ start time ban đầu
            console.warn("⚠️ Invalid start time detected, using current time but preserving elapsed time");
            
            // Nếu đã có original start time, giữ nguyên
            if (originalStartTimeRef.current) {
              sessionStartTimeRef.current = originalStartTimeRef.current;
            } else {
              // Lần đầu tiên, tạo start time mới
              sessionStartTimeRef.current = new Date();
              originalStartTimeRef.current = sessionStartTimeRef.current;
            }
            
            // Khôi phục lại giá trị đúng vào sessionStorage
            const correctHash = createTimerHash(
              round.roundId,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(
              storageKey,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(hashKey, correctHash);
            sessionStorage.setItem(currentRoundIdKey, round.roundId);
            console.log("🔒 Restored original start time to prevent cheating");
          }
        } else {
          // Hash không khớp - có thể bị gian lận
          // KHÔNG reset timer, khôi phục lại từ original start time
          console.warn(
            "⚠️ Hash verification failed - possible tampering detected, restoring original start time"
          );
          
          if (originalStartTimeRef.current) {
            // Khôi phục lại start time ban đầu
            sessionStartTimeRef.current = originalStartTimeRef.current;
            const correctHash = createTimerHash(
              round.roundId,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(
              storageKey,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(hashKey, correctHash);
            sessionStorage.setItem(currentRoundIdKey, round.roundId);
            console.log("🔒 Restored original start time:", sessionStartTimeRef.current);
          } else {
            // Nếu chưa có original start time (trường hợp hiếm), tạo mới
            // Nhưng chỉ khi thực sự là lần đầu tiên
            console.warn("⚠️ No original start time found, creating new one");
            sessionStartTimeRef.current = new Date();
            originalStartTimeRef.current = sessionStartTimeRef.current;
            const newHash = createTimerHash(
              round.roundId,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(
              storageKey,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(hashKey, newHash);
            sessionStorage.setItem(currentRoundIdKey, round.roundId);
            console.log("🆕 Created new timer start time");
          }
        }
      } else {
        // Lần đầu vào page cho round này - tạo start time mới (NOW)
        sessionStartTimeRef.current = new Date();
        originalStartTimeRef.current = sessionStartTimeRef.current; // Lưu start time ban đầu
        const hash = createTimerHash(
          round.roundId,
          sessionStartTimeRef.current.toISOString()
        );
        sessionStorage.setItem(
          storageKey,
          sessionStartTimeRef.current.toISOString()
        );
        sessionStorage.setItem(hashKey, hash);
        sessionStorage.setItem(currentRoundIdKey, round.roundId);
       
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
      // Verify hash mỗi lần update để phát hiện gian lận real-time
      const storageKey = `round_timer_start_${userId}_${round.roundId}`;
      const hashKey = `round_timer_hash_${userId}_${round.roundId}`;
      const savedStartTime = sessionStorage.getItem(storageKey);
      const savedHash = sessionStorage.getItem(hashKey);
      
      if (savedStartTime && savedHash) {
        const isValid = verifyTimerHash(round.roundId, savedStartTime, savedHash);
        if (!isValid) {
          console.error("🚨 Timer tampering detected during update!");
          
          // Khôi phục lại start time ban đầu từ ref
          if (originalStartTimeRef.current) {
            sessionStartTimeRef.current = originalStartTimeRef.current;
            const correctHash = createTimerHash(
              round.roundId,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(
              storageKey,
              sessionStartTimeRef.current.toISOString()
            );
            sessionStorage.setItem(hashKey, correctHash);
            console.log("🔒 Restored original start time during update");
          }
        } else {
          // Nếu hash hợp lệ, đảm bảo sessionStartTimeRef đồng bộ với sessionStorage
          // nhưng không cho phép thay đổi nếu đã có original start time
          if (originalStartTimeRef.current) {
            const parsedSavedTime = new Date(savedStartTime);
            // Chỉ cập nhật nếu giá trị trong storage khớp với original
            if (parsedSavedTime.getTime() !== originalStartTimeRef.current.getTime()) {
              // Giá trị đã bị thay đổi, khôi phục lại
              sessionStartTimeRef.current = originalStartTimeRef.current;
              const correctHash = createTimerHash(
                round.roundId,
                sessionStartTimeRef.current.toISOString()
              );
              sessionStorage.setItem(
                storageKey,
                sessionStartTimeRef.current.toISOString()
              );
              sessionStorage.setItem(hashKey, correctHash);
              console.log("🔒 Detected time change, restored original");
            }
          }
        }
      }

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
  }, [round?.roundId, round?.timeLimitSeconds, calculateTimeRemaining, onExpired]);

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
