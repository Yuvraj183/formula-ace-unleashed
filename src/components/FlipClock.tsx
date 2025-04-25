
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
      
      setTime({
        hours: hours.toString().padStart(2, "0"),
        minutes: now.getMinutes().toString().padStart(2, "0"),
        seconds: now.getSeconds().toString().padStart(2, "0"),
        ampm,
      });
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex items-center justify-center space-x-2">
        {/* Hours */}
        <div className="flip-clock-card h-16 w-16">
          <div className="flip-clock-top flex items-center justify-center">
            {time.hours[0]}
          </div>
          <div className="flip-clock-bottom flex items-center justify-center">
            {time.hours[0]}
          </div>
        </div>
        <div className="flip-clock-card h-16 w-16">
          <div className="flip-clock-top flex items-center justify-center">
            {time.hours[1]}
          </div>
          <div className="flip-clock-bottom flex items-center justify-center">
            {time.hours[1]}
          </div>
        </div>

        <div className="text-4xl font-bold">:</div>

        {/* Minutes */}
        <div className="flip-clock-card h-16 w-16">
          <div className="flip-clock-top flex items-center justify-center">
            {time.minutes[0]}
          </div>
          <div className="flip-clock-bottom flex items-center justify-center">
            {time.minutes[0]}
          </div>
        </div>
        <div className="flip-clock-card h-16 w-16">
          <div className="flip-clock-top flex items-center justify-center">
            {time.minutes[1]}
          </div>
          <div className="flip-clock-bottom flex items-center justify-center">
            {time.minutes[1]}
          </div>
        </div>

        <div className="text-4xl font-bold">:</div>

        {/* Seconds */}
        <div className="flip-clock-card h-16 w-16">
          <div className="flip-clock-top flex items-center justify-center">
            {time.seconds[0]}
          </div>
          <div className="flip-clock-bottom flex items-center justify-center">
            {time.seconds[0]}
          </div>
        </div>
        <div className="flip-clock-card h-16 w-16">
          <div className="flip-clock-top flex items-center justify-center">
            {time.seconds[1]}
          </div>
          <div className="flip-clock-bottom flex items-center justify-center">
            {time.seconds[1]}
          </div>
        </div>

        {/* AM/PM */}
        <div className="text-lg font-bold bg-primary text-white px-2 py-1 rounded">
          {time.ampm}
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
