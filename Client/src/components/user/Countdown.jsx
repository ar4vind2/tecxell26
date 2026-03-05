import { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div className="countdown-container">
      <div className="countdown-item pixel-border">
        <span className="countdown-value pixel-text-shadow">{formatTime(timeLeft.days)}</span>
        <span className="countdown-label">DAYS</span>
      </div>
      <div className="countdown-item pixel-border">
        <span className="countdown-value pixel-text-shadow">{formatTime(timeLeft.hours)}</span>
        <span className="countdown-label">HRS</span>
      </div>
      <div className="countdown-item pixel-border">
        <span className="countdown-value pixel-text-shadow">{formatTime(timeLeft.minutes)}</span>
        <span className="countdown-label">MIN</span>
      </div>
      <div className="countdown-item pixel-border">
        <span className="countdown-value pixel-text-shadow">{formatTime(timeLeft.seconds)}</span>
        <span className="countdown-label">SEC</span>
      </div>
    </div>
  );
};

export default Countdown;
