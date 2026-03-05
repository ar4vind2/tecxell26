import { useState, useEffect } from 'react';
import './Typewriter.css';

const TypewriterText = ({ text, delay = 30 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return (
        <div className="typewriter-container">
            {/* Invisible full text maintains the container size to prevent layout shifts */}
            <div className="typewriter-ghost" aria-hidden="true">{text}</div>
            {/* Visible typing text positioned absolutely over the ghost text */}
            <div className="typewriter-visible">
                {currentText}
                <span className="typewriter-cursor"></span>
            </div>
        </div>
    );
};

export default TypewriterText;
