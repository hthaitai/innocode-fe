import React, { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
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
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n) => (n < 10 ? "0" + n : n);

  return (
    <div className="p-6 h-[280px] rounded-lg shadow text-center border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">Contest Starts In</h2>
      <hr className="mb-4" />

      {timeLeft ? (
        <>
          <div className="flex justify-center gap-3 mb-4">
            {timeLeft.days > 0 && (
              <div className="border rounded-md px-3 py-2 w-16">
                <div className="text-xl font-bold">{pad(timeLeft.days)}</div>
                <div className="text-xs">Days</div>
              </div>
            )}
            <div className="border rounded-md px-3 py-2 w-16">
              <div className="text-xl font-bold">{pad(timeLeft.hours)}</div>
              <div className="text-xs">Hrs</div>
            </div>
            <div className="border rounded-md px-3 py-2 w-16">
              <div className="text-xl font-bold">{pad(timeLeft.minutes)}</div>
              <div className="text-xs">Min</div>
            </div>
            <div className="border rounded-md px-3 py-2 w-16">
              <div className="text-xl font-bold">{pad(timeLeft.seconds)}</div>
              <div className="text-xs">Sec</div>
            </div>
          </div>

          <button className="bg-[#E94F26] text-white px-4 py-2 rounded hover:bg-[#d4421b] transition">
            Start contest
          </button>
        </>
      ) : (
        <div className="mt-8">
          <p className="text-lg font-semibold text-green-600 mb-3">
            Contest Started!
          </p>
          <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
            Ongoing
          </button>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
