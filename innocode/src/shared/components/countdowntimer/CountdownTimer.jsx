import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const CountdownTimer = ({ 
  targetDate, 
  label = "Time Remaining",
  showIcon = true,
  compact = false,
  onExpired = null 
}) => {
  const { t } = useTranslation("common");
  const calculateTimeLeft = () => {
    if (!targetDate) return null;
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return null;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Call onExpired callback when countdown finishes
      if (!newTimeLeft && onExpired) {
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n) => (n < 10 ? "0" + n : n);

  // Compact version - just the timer grid
  if (compact) {
    return timeLeft ? (
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
          <div className="text-2xl font-bold text-[#2d3748]">
            {pad(timeLeft.days)}
          </div>
          <div className="text-xs text-[#7A7574]">Days</div>
        </div>
        <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
          <div className="text-2xl font-bold text-[#2d3748]">
            {pad(timeLeft.hours)}
          </div>
          <div className="text-xs text-[#7A7574]">Hours</div>
        </div>
        <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
          <div className="text-2xl font-bold text-[#2d3748]">
            {pad(timeLeft.minutes)}
          </div>
          <div className="text-xs text-[#7A7574]">Minutes</div>
        </div>
        <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
          <div className="text-2xl font-bold text-[#2d3748]">
            {pad(timeLeft.seconds)}
          </div>
          <div className="text-xs text-[#7A7574]">Seconds</div>
        </div>
      </div>
    ) : (
      <div className="text-center py-6">
        <Icon
          icon="mdi:clock-alert-outline"
          width="48"
          className="text-[#7A7574] mx-auto mb-2 opacity-50"
        />
        <p className="text-sm text-[#7A7574]">{t("common.timeExpired")}</p>
      </div>
    );
  }

  // Full version with card wrapper
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
      {label && (
        <h3 className="text-sm font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
          {showIcon && <Clock size={16} className="text-[#ff6b35]" />}
          {label}
        </h3>
      )}
      {timeLeft ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
            <div className="text-2xl font-bold text-[#2d3748]">
              {pad(timeLeft.days)}
            </div>
            <div className="text-xs text-[#7A7574]">Days</div>
          </div>
          <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
            <div className="text-2xl font-bold text-[#2d3748]">
              {pad(timeLeft.hours)}
            </div>
            <div className="text-xs text-[#7A7574]">Hours</div>
          </div>
          <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
            <div className="text-2xl font-bold text-[#2d3748]">
              {pad(timeLeft.minutes)}
            </div>
            <div className="text-xs text-[#7A7574]">Minutes</div>
          </div>
          <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
            <div className="text-2xl font-bold text-[#2d3748]">
              {pad(timeLeft.seconds)}
            </div>
            <div className="text-xs text-[#7A7574]">Seconds</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Icon
            icon="mdi:clock-alert-outline"
            width="48"
            className="text-[#7A7574] mx-auto mb-2 opacity-50"
          />
          <p className="text-sm text-[#7A7574]">{t("common.timeExpired")}</p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
