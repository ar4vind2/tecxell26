import React, { useState, useEffect } from 'react';
import './Hero.css';
import Countdown from './Countdown';
import WinnersModal from './WinnersModal';

const Hero = () => {
    const [isWinnerTime, setIsWinnerTime] = useState(false);
    const [showWinnersModal, setShowWinnersModal] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const target = new Date('2026-03-18T09:30:00');
            setIsWinnerTime(now >= target);
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-section" id="hero">
            <div className="hero-scanlines"></div>
            <div className="container hero-content-wrapper">
                <div className="hero-content pixel-border" data-aos="zoom-in" data-aos-duration="1500">
                    <h1 className="hero-main-title pixel-text-shadow">TECXELL '26</h1>

                    <p className="techfest-date blink-text mt-4">
                        MAR 18 • 2026
                    </p>

                    {isWinnerTime ? (
                        <div className="mt-4" style={{ textAlign: 'center' }}>
                            <button 
                                onClick={() => setShowWinnersModal(true)}
                                className="pixel-btn btn-style-yellow pixel-text-shadow"
                                style={{ 
                                    padding: '15px 40px', 
                                    fontSize: '1.2rem',
                                    animation: 'pulse 2s infinite'
                                }}
                            >
                                VIEW WINNERS🏆
                            </button>
                        </div>
                    ) : (
                        <Countdown targetDate="2026-03-18T00:00:00" />
                    )}

                    <div className="cta-wrapper mt-5" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="#events" className="pixel-btn btn-style-red pixel-text-shadow">START ADVENTURE</a>
                        <a href="/brochure.pdf" download className="pixel-btn btn-style-blue pixel-text-shadow">BROCHURE</a>
                    </div>
                </div>
            </div>

            <WinnersModal 
                isOpen={showWinnersModal} 
                onClose={() => setShowWinnersModal(false)} 
            />
        </section>
    );
};

export default Hero;
