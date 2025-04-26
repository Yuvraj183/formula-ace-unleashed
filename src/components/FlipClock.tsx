
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
    <div className="flex justify-center">
      <div className="flex items-center justify-center text-center">
        <div className="bg-gray-800 text-white rounded-lg p-3 text-4xl font-mono flex items-center">
          <div className="mx-1 px-2">{time.hours}</div>
          <div className="mx-0 animate-pulse">:</div>
          <div className="mx-1 px-2">{time.minutes}</div>
          <div className="mx-0 animate-pulse">:</div>
          <div className="mx-1 px-2">{time.seconds}</div>
          <div className="bg-primary text-white font-bold text-lg ml-2 px-2 rounded">
            {time.ampm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
