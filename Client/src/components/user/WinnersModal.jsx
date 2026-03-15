import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import './WinnersModal.css';

const WinnersModal = ({ isOpen, onClose }) => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchWinners = async () => {
                try {
                    const response = await api.get('/winners');
                    setWinners(response.data.winners || []);
                } catch (error) {
                    console.error('Error fetching winners:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchWinners();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Group winners by event
    const groupedWinners = winners.reduce((acc, curr) => {
        if (!acc[curr.eventName]) {
            acc[curr.eventName] = [];
        }
        acc[curr.eventName].push(curr);
        return acc;
    }, {});

    return (
        <div className="winners-modal-overlay">
            <div className="winners-modal-content pixel-border">
                <button 
                    onClick={onClose}
                    className="winners-close-btn"
                >
                    [X]
                </button>

                <h2 className="pixel-text-shadow text-arcade-yellow winners-title">
                    🏆 HALL OF FAME 🏆
                </h2>

                {loading ? (
                    <div className="glitch-text" style={{ textAlign: 'center', color: 'var(--arcade-yellow)' }}>LOADING WINNERS...</div>
                ) : winners.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#555', padding: '40px' }}>
                        THE BATTLE IS STILL ON-GOING...<br/>
                        CHECK BACK LATER!
                    </div>
                ) : (
                    <div className="winners-grid-list">
                        {Object.keys(groupedWinners).map(eventName => (
                            <div key={eventName} className="event-winner-card">
                                <h3 className="event-title-badge">
                                    {eventName.toUpperCase()}
                                </h3>
                                
                                <div className="winners-sub-grid">
                                    {groupedWinners[eventName].sort((a,b) => a.prize.localeCompare(b.prize)).map((winner, idx) => (
                                        <div key={idx} className={`winner-item ${winner.prize === '1st Prize' ? 'winner-item-1st' : 'winner-item-2nd'}`}>
                                            <div className="prize-label" style={{ 
                                                color: winner.prize === '1st Prize' ? 'var(--arcade-yellow)' : 'var(--arcade-blue)'
                                            }}>
                                                {winner.prize === '1st Prize' ? '🥇 1ST PRIZE' : '🥈 2ND PRIZE'}
                                            </div>
                                            <div className="winner-player-name">
                                                {Array.isArray(winner.playerName) ? winner.playerName.join(' & ') : winner.playerName}
                                            </div>
                                            {winner.teamName && (
                                                <div className="winner-team-info">
                                                    TEAM: {winner.teamName}
                                                </div>
                                            )}
                                            <div className="winner-college-info">
                                                {winner.college}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WinnersModal;
