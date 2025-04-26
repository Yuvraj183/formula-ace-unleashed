
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

  const [flipped, setFlipped] = useState({
    hours: false,
    minutes: false,
    seconds: false,
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
      
      setTime(prev => {
        // Determine which units have changed to trigger animations
        const newFlipped = {
          hours: prev.hours !== hours.toString().padStart(2, "0"),
          minutes: prev.minutes !== minutes.toString().padStart(2, "0"),
          seconds: prev.seconds !== seconds.toString().padStart(2, "0"),
        };
        
        setFlipped(newFlipped);
        
        return {
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
          ampm,
        };
      });
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center">
      <style>
        {`
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          50%, 100% { transform: rotateX(-90deg); }
        }
        
        @keyframes flipBottom {
          0%, 50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        
        .flip-card-top.flipped {
          animation: flipTop 0.5s ease-in;
          transform-origin: bottom center;
        }
        
        .flip-card-bottom.flipped {
          animation: flipBottom 0.5s ease-out;
          transform-origin: top center;
        }
      `}
      </style>
      <div className="flex items-center justify-center space-x-2">
        {/* Hours */}
        <div className="group">
          <div className="flip-clock-card h-16 w-16 relative">
            <div className={`flip-card-top absolute h-1/2 w-full bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-900 text-white flex items-end justify-center text-2xl ${flipped.hours ? 'flipped' : ''}`}>
              {time.hours[0]}
            </div>
            <div className={`flip-card-bottom absolute top-1/2 h-1/2 w-full bg-gray-700 rounded-b-lg overflow-hidden text-white flex items-start justify-center text-2xl ${flipped.hours ? 'flipped' : ''}`}>
              {time.hours[0]}
            </div>
          </div>
          <div className="flip-clock-card h-16 w-16 relative ml-1">
            <div className={`flip-card-top absolute h-1/2 w-full bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-900 text-white flex items-end justify-center text-2xl ${flipped.hours ? 'flipped' : ''}`}>
              {time.hours[1]}
            </div>
            <div className={`flip-card-bottom absolute top-1/2 h-1/2 w-full bg-gray-700 rounded-b-lg overflow-hidden text-white flex items-start justify-center text-2xl ${flipped.hours ? 'flipped' : ''}`}>
              {time.hours[1]}
            </div>
          </div>
        </div>

        <div className="text-4xl font-bold text-gray-800">:</div>

        {/* Minutes */}
        <div className="group">
          <div className="flip-clock-card h-16 w-16 relative">
            <div className={`flip-card-top absolute h-1/2 w-full bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-900 text-white flex items-end justify-center text-2xl ${flipped.minutes ? 'flipped' : ''}`}>
              {time.minutes[0]}
            </div>
            <div className={`flip-card-bottom absolute top-1/2 h-1/2 w-full bg-gray-700 rounded-b-lg overflow-hidden text-white flex items-start justify-center text-2xl ${flipped.minutes ? 'flipped' : ''}`}>
              {time.minutes[0]}
            </div>
          </div>
          <div className="flip-clock-card h-16 w-16 relative ml-1">
            <div className={`flip-card-top absolute h-1/2 w-full bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-900 text-white flex items-end justify-center text-2xl ${flipped.minutes ? 'flipped' : ''}`}>
              {time.minutes[1]}
            </div>
            <div className={`flip-card-bottom absolute top-1/2 h-1/2 w-full bg-gray-700 rounded-b-lg overflow-hidden text-white flex items-start justify-center text-2xl ${flipped.minutes ? 'flipped' : ''}`}>
              {time.minutes[1]}
            </div>
          </div>
        </div>

        <div className="text-4xl font-bold text-gray-800">:</div>

        {/* Seconds */}
        <div className="group">
          <div className="flip-clock-card h-16 w-16 relative">
            <div className={`flip-card-top absolute h-1/2 w-full bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-900 text-white flex items-end justify-center text-2xl ${flipped.seconds ? 'flipped' : ''}`}>
              {time.seconds[0]}
            </div>
            <div className={`flip-card-bottom absolute top-1/2 h-1/2 w-full bg-gray-700 rounded-b-lg overflow-hidden text-white flex items-start justify-center text-2xl ${flipped.seconds ? 'flipped' : ''}`}>
              {time.seconds[0]}
            </div>
          </div>
          <div className="flip-clock-card h-16 w-16 relative ml-1">
            <div className={`flip-card-top absolute h-1/2 w-full bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-900 text-white flex items-end justify-center text-2xl ${flipped.seconds ? 'flipped' : ''}`}>
              {time.seconds[1]}
            </div>
            <div className={`flip-card-bottom absolute top-1/2 h-1/2 w-full bg-gray-700 rounded-b-lg overflow-hidden text-white flex items-start justify-center text-2xl ${flipped.seconds ? 'flipped' : ''}`}>
              {time.seconds[1]}
            </div>
          </div>
        </div>

        {/* AM/PM */}
        <div className="text-lg font-bold bg-primary text-white px-3 py-2 rounded ml-2">
          {time.ampm}
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
