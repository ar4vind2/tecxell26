import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsData } from '../../data/eventsData';
import RegistrationModal from './RegistrationModal';
import api from '../../utils/axios';
import './Events.css';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const event = eventsData.find((e) => e.id === eventId);

    // State to control Modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eFootballSeats, setEFootballSeats] = useState(0);
    const [miniMilitiaSeats, setMiniMilitiaSeats] = useState(0);
    const [treasureHuntSeats, setTreasureHuntSeats] = useState(0);

    useEffect(() => {
        if (event?.id === 'e-football') {
            api.get('/eFootballCount')
                .then(res => setEFootballSeats(res.data.count))
                .catch(() => setEFootballSeats(0));
        }
        if (event?.id === 'mini-militia') {
            api.get('/miniMilitiaCount')
                .then(res => setMiniMilitiaSeats(res.data.count))
                .catch(() => setMiniMilitiaSeats(0));
        }
        if (event?.id === 'treasure-hunt') {
            api.get('/treasureHuntCount')
                .then(res => setTreasureHuntSeats(res.data.count))
                .catch(() => setTreasureHuntSeats(0));
        }
    }, [event?.id]);

    if (!event) {
        return (
            <div className="event-details-page container not-found">
                <h2 className="pixel-text-shadow">EVENT NOT FOUND</h2>
                <p>The stage you are looking for does not exist.</p>
                <Link to="/" className="arcade-btn">RETURN TO HOME</Link>
            </div>
        );
    }

    return (
        <div className="event-details-page container">
            <Link to="/" className="back-link">
                &lt; BACK TO STAGES
            </Link>

            <div className="event-header">
                <div className="event-title-group">
                    <h1 className="pixel-text-shadow event-title-main">{event.title}</h1>
                    {event.theme && (
                        <span className={`event-theme-label text-arcade-${event.color}`}>
                            ▶ {event.theme}
                        </span>
                    )}

                    <div 
                        className="warning-notice pixel-border" 
                        style={{ 
                            marginTop: '15px', 
                            padding: '10px', 
                            backgroundColor: 'rgba(255, 0, 0, 0.2)', 
                            border: '1px solid #ff4444',
                            borderRadius: '4px',
                            color: '#ffcccc',
                            fontSize: '1.2rem',
                            maxWidth: '600px',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        <strong>⚠️ WARNING:</strong> Avoid registering for events with same time. If registered by mistake, contact the coordinators!
                    </div>
                </div>
                {/* Desktop: show image */}
                <img
                    src={event.icon}
                    alt={event.title}
                    className="event-icon-large text-shadow-glow event-icon-desktop"
                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
                {/* Mobile: show theme badge instead of image */}
                {event.theme && (
                    <div className={`event-theme-badge pixel-border card-${event.color} event-icon-mobile`}>
                        <span className={`theme-badge-text text-arcade-${event.color}`}>{event.theme}</span>
                    </div>
                )}
            </div>

            <div className="event-content-grid">
                <div className="main-info">
                    <div className={`info-box pixel-border card-${event.color}`}>
                        <h3>MISSION BRIEF</h3>
                        <p className="full-description">{event.fullDescription}</p>
                    </div>

                    <div className="rules-section">
                        <h3 className="section-subtitle">RULES OF ENGAGEMENT</h3>
                        <ul className="rules-list">
                            {event.rules.map((rule, idx) => (
                                <li key={idx}>
                                    <span className="bullet-point">►</span> {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {event.judging && event.judging.length > 0 && (
                        <div className="rules-section" style={{ marginTop: '40px' }}>
                            <h3 className="section-subtitle">JUDGING CRITERIA</h3>
                            <ul className="rules-list">
                                {event.judging.map((criteria, idx) => (
                                    <li key={idx}>
                                        <span className="bullet-point">★</span> {criteria}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="side-panel">
                    <div className="stats-box">
                        <div className="stats-box">
                            <div className="stat-item">
                                <span className="stat-label">REWARDS:</span>
                                {Array.isArray(event.prize) ? (
                                    event.prize.map((p, i) => (
                                        <span key={i} className="stat-value text-shadow-glow" style={{ color: `var(--arcade-${event.color})`, fontSize: '1.2rem', marginBottom: '5px' }}>
                                            {p}
                                        </span>
                                    ))
                                ) : (
                                    <span className="stat-value text-shadow-glow" style={{ color: `var(--arcade-${event.color})` }}>
                                        {event.prize}
                                    </span>
                                )}
                            </div>
                            {event.fee && (
                                <div className="stat-item" style={{ marginTop: '15px' }}>
                                    <span className="stat-label">REGISTRATION FEE:</span>
                                    <span className="stat-value" style={{ color: '#fff' }}>
                                        {event.fee}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="logistics-box">
                        <p><strong>DATE:</strong> {event.date}</p>
                        <p><strong>TIME:</strong> {event.time}</p>
                        <p><strong>VENUE:</strong> {event.venue}</p>
                    </div>

                    <div className="coordinators-box">
                        <h4>COORDINATORS:</h4>
                        <ul>
                            {event.coordinators.map((coord, idx) => (
                                <li key={idx}>{coord}</li>
                            ))}
                        </ul>
                    </div>

                    {event.id === 'e-football' && (
                        <div className="progress-box pixel-border card-yellow">
                            <h4 className="progress-title">SEAT AVAILABILITY</h4>
                            <div className="progress-stats">
                                <span className="seats-remaining blink-text text-arcade-yellow">
                                    {eFootballSeats >= 32 ? 'LOBBY FULL' : `${32 - eFootballSeats} SEATS REMAINING`}
                                </span>
                                <span className="seats-total">{eFootballSeats} / 32 BOOKED</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${(eFootballSeats / 32) * 100}%` }}></div>
                            </div>
                        </div>
                    )}

                    {event.id === 'mini-militia' && (
                        <div className="progress-box pixel-border card-pink">
                            <h4 className="progress-title">SEAT AVAILABILITY</h4>
                            <div className="progress-stats">
                                <span className="seats-remaining blink-text text-arcade-pink">
                                    {miniMilitiaSeats >= 40 ? 'LOBBY FULL' : `${40 - miniMilitiaSeats} SEATS REMAINING`}
                                </span>
                                <span className="seats-total">{miniMilitiaSeats} / 40 BOOKED</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${(miniMilitiaSeats / 40) * 100}%` }}></div>
                            </div>
                        </div>
                    )}

                    {event.id === 'treasure-hunt' && (
                        <div className="progress-box pixel-border card-yellow">
                            <h4 className="progress-title">TEAM AVAILABILITY</h4>
                            <div className="progress-stats">
                                <span className="seats-remaining blink-text text-arcade-yellow">
                                    {treasureHuntSeats >= 10 ? 'LOBBY FULL' : `${10 - treasureHuntSeats} TEAMS REMAINING`}
                                </span>
                                <span className="seats-total">{treasureHuntSeats} / 10 BOOKED</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${(treasureHuntSeats / 10) * 100}%` }}></div>
                            </div>
                        </div>
                    )}

                    <button
                        className={`register-btn-large btn-style-${event.color} blink-text-subtle`}
                        onClick={() => setIsModalOpen(true)}
                        disabled={(event.id === 'e-football' && eFootballSeats >= 32) || (event.id === 'mini-militia' && miniMilitiaSeats >= 40) || (event.id === 'treasure-hunt' && treasureHuntSeats >= 10)}
                        style={{
                            opacity: (event.id === 'e-football' && eFootballSeats >= 32) || (event.id === 'mini-militia' && miniMilitiaSeats >= 40) || (event.id === 'treasure-hunt' && treasureHuntSeats >= 10) ? 0.5 : 1,
                            cursor: (event.id === 'e-football' && eFootballSeats >= 32) || (event.id === 'mini-militia' && miniMilitiaSeats >= 40) || (event.id === 'treasure-hunt' && treasureHuntSeats >= 10) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {(event.id === 'e-football' && eFootballSeats >= 32) || (event.id === 'mini-militia' && miniMilitiaSeats >= 40) || (event.id === 'treasure-hunt' && treasureHuntSeats >= 10) ? 'LOBBY FULL' : 'INITIATE REGISTRATION'}
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <RegistrationModal
                    eventId={event.id}
                    eventTitle={event.title}
                    eventColor={event.color}
                    isTeamEvent={event.isTeamEvent}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(data) => console.log('Registered Data:', data)}
                />
            )}
        </div>
    );
};

export default EventDetailsPage;
