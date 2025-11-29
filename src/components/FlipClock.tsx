
import { useState, useEffect } from "react";

const FlipClock = () => {
  const [time, setTime] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    ampm: string;
  }>({
    hours: "12",
    minutes: "00",
    seconds: "00",
    ampm: "AM",
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      setTime({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        ampm,
      });
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center justify-center text-center">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl sm:rounded-2xl p-2 sm:p-4 lg:p-6 shadow-2xl border-2 border-gray-700">
          <div className="flex items-center justify-center gap-1 sm:gap-2 text-xl sm:text-3xl lg:text-5xl font-mono font-bold">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 px-1.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg shadow-inner border border-gray-700 min-w-[2rem] sm:min-w-[3rem] lg:min-w-[4rem] text-center">
              {time.hours}
            </div>
            <div className="text-primary animate-pulse text-2xl sm:text-4xl lg:text-6xl">:</div>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 px-1.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg shadow-inner border border-gray-700 min-w-[2rem] sm:min-w-[3rem] lg:min-w-[4rem] text-center">
              {time.minutes}
            </div>
            <div className="text-primary animate-pulse text-2xl sm:text-4xl lg:text-6xl">:</div>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 px-1.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg shadow-inner border border-gray-700 min-w-[2rem] sm:min-w-[3rem] lg:min-w-[4rem] text-center">
              {time.seconds}
            </div>
          </div>
          <div className="mt-1.5 sm:mt-3 lg:mt-4 flex justify-center">
            <div className="bg-primary text-primary-foreground font-bold text-sm sm:text-lg lg:text-2xl px-2 sm:px-4 lg:px-6 py-0.5 sm:py-1 lg:py-2 rounded-lg shadow-lg">
              {time.ampm}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
