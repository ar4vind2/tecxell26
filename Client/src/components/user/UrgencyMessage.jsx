import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const UrgencyMessage = () => {
    const [counts, setCounts] = useState({
        efootball: 0,
        minimilitia: 0,
        treasurehunt: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const LIMITS = {
        efootball: 32,
        minimilitia: 40,
        treasurehunt: 10
    };

    const OFFSETS = {
        efootball: 20,
        minimilitia: 26,
        treasurehunt: 5
    };

    const EVENT_NAMES = {
        efootball: 'E-FOOTBALL',
        minimilitia: 'MINI MILITIA',
        treasurehunt: 'TREASURE HUNT'
    };

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [efootball, minimilitia, treasurehunt] = await Promise.all([
                    api.get('/eFootballCount'),
                    api.get('/miniMilitiaCount'),
                    api.get('/treasureHuntCount')
                ]);

                setCounts({
                    efootball: efootball.data.count,
                    minimilitia: minimilitia.data.count,
                    treasurehunt: treasurehunt.data.count
                });
            } catch (error) {
                console.error('Error fetching urgency counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
        
        // Refresh counts every 30 seconds
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (loading) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % 3);
        }, 5000);

        return () => clearInterval(timer);
    }, [loading]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsVisible(true);
        }, 10000);
    };

    if (loading || !isVisible) return null;

    const eventKeys = Object.keys(LIMITS);
    const currentKey = eventKeys[currentIndex];
    const displayBooked = counts[currentKey] + OFFSETS[currentKey];
    const remaining = Math.max(0, LIMITS[currentKey] - displayBooked);

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
                    color: 'var(--arcade-red)', 
                    fontSize: '0.8rem',
                    textShadow: '2px 2px 0px #000, 0 0 10px rgba(255,0,0,0.5)',
                    letterSpacing: '1px',
                    paddingRight: '20px'
                }}>
                    ALERT: LIMITED SEATS
                </div>
                
                <div style={{ 
                    borderLeft: '4px solid var(--arcade-blue)', 
                    paddingLeft: '10px',
                    background: 'rgba(0, 240, 255, 0.05)',
                    margin: '2px 0'
                }}>
                    <div style={{ fontSize: '0.7rem' }}>
                        {EVENT_NAMES[currentKey]}: <span style={{ color: 'var(--arcade-green)' }}>{remaining} LEFT</span>
                    </div>
                </div>

                <div className="blink-text-subtle" style={{ 
                    fontSize: '0.55rem', 
                    color: 'var(--arcade-blue)',
                    textAlign: 'center',
                    marginTop: '4px'
                }}>
                    &gt;&gt; REGISTER NOW &lt;&lt;
                </div>
            </div>
        </div>
    );
};

export default UrgencyMessage;
