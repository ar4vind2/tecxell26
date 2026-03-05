import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        // Fast retro loading sequence
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 20) + 30; // Faster increment
            });
        }, 100);

        if (progress >= 100) {
            setIsFinishing(true);
            const finalDelay = setTimeout(() => {
                onComplete();
            }, 300);
            return () => clearTimeout(finalDelay);
        }

        return () => clearInterval(interval);
    }, [progress, onComplete]);

    return (
        <div className={`loading-screen ${isFinishing ? 'finishing' : ''}`}>
            <div className="retro-3d-grid"></div>
            <div className="loading-crt-overlay"></div>

            <div className="loading-content">
                <h1 className="loading-logo pixel-3d-text" data-text="INSERT COIN">INSERT COIN</h1>

                <div className="pacman-loader-container">
                    <div className="pacman">
                        <div className="pacman-top"></div>
                        <div className="pacman-bottom"></div>
                    </div>
                    <div className="dots-container">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="dot"></div>
                        ))}
                    </div>
                </div>

                <div className="loading-info">
                    <span className="loading-text blink-text">LOADING STAGE 1...</span>
                    <span className="loading-percentage">{progress}%</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
