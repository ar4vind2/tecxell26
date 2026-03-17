import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const UrgencyMessage = ({ eventId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const SPOT_DATA = {
        'vibe-coding': { time: '11:30 AM', venue: 'Vinton Cerf Lab' },
        'treasure-hunt': { time: '09:30 AM', venue: 'Room No: M016' },
        'computer-quiz': { time: '01:00 PM', venue: 'Room No: M015' },
        'poster-making': { time: '09:30 AM', venue: 'Vinton Cerf Lab' },
        'reel-making': { time: '09:30 AM', venue: 'Room No: M014' },
        'e-football': { time: '10:00 AM', venue: 'Room No: M015' },
        'mini-militia': { time: '09:30 AM', venue: 'Room No: M014' }
    };

    const EVENT_DISPLAY_NAMES = {
        'vibe-coding': 'VIBE CODING',
        'treasure-hunt': 'TREASURE HUNT',
        'computer-quiz': 'COMPUTER QUIZ',
        'poster-making': 'POSTER MAKING',
        'reel-making': 'REEL MAKING',
        'e-football': 'E-FOOTBALL',
        'mini-militia': 'MINI MILITIA'
    };

    const eventKeys = Object.keys(SPOT_DATA);

    useEffect(() => {
        if (eventId) return; // Don't cycle if we're on a specific event page

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % eventKeys.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [eventId, eventKeys.length]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsVisible(true);
        }, 10000);
    };

    if (!isVisible) return null;

    // Determine which event to show
    const currentEventId = eventId || eventKeys[currentIndex];
    const data = SPOT_DATA[currentEventId];

    if (!data) return null;

    return (
        <div className="urgency-floating-badge">
            <div className="urgency-inner-content">
                <button 
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--arcade-blue)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontFamily: '"Press Start 2P", cursive',
                        zIndex: 10000,
                        padding: '5px'
                    }}
                    className="hover-blink"
                >
                    [X]
                </button>
                {/* Scanline Effect Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)',
                    backgroundSize: '100% 2px',
                    pointerEvents: 'none',
                    opacity: 0.5
                }}></div>

                <div className="blink-text" style={{ 
                    color: 'var(--arcade-yellow)', 
                    fontSize: '0.75rem',
                    textShadow: '2px 2px 0px #000, 0 0 10px rgba(255,215,0,0.5)',
                    letterSpacing: '1px',
                    paddingRight: '20px'
                }}>
                    SPOT REGISTRATION OPEN!
                </div>
                
                <div style={{ 
                    borderLeft: '4px solid var(--arcade-blue)', 
                    paddingLeft: '12px',
                    background: 'rgba(0, 240, 255, 0.05)',
                    margin: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>
                        {EVENT_DISPLAY_NAMES[currentEventId]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--arcade-blue)' }}>
                        TIME: <span style={{ color: '#fff' }}>{data.time}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--arcade-green)' }}>
                        VENUE: <span style={{ color: '#fff' }}>{data.venue}</span>
                    </div>
                </div>

                <div className="blink-text-subtle" style={{ 
                    fontSize: '0.5rem', 
                    color: 'var(--arcade-pink)',
                    textAlign: 'center',
                    marginTop: '4px'
                }}>
                    &gt;&gt; REGISTER FOR SPOT &lt;&lt;
                </div>
            </div>
        </div>
    );
};

export default UrgencyMessage;
