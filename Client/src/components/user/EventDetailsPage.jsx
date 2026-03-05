import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsData } from '../../data/eventsData';
import RegistrationModal from './RegistrationModal';
import './Events.css';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const { eventId } = useParams();
    const event = eventsData.find((e) => e.id === eventId);

    // State to control Modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                <h1 className="pixel-text-shadow event-title-main">{event.title}</h1>
                <img
                    src={event.icon}
                    alt={event.title}
                    className="event-icon-large text-shadow-glow"
                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
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
                </div>

                <div className="side-panel">
                    <div className="stats-box">
                        <div className="stat-item">
                            <span className="stat-label">REWARD:</span>
                            <span className="stat-value text-shadow-glow" style={{ color: `var(--arcade-${event.color})` }}>
                                {event.prize}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">POINTS:</span>
                            <span className="stat-value">{event.points}</span>
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
                                    {event.bookedSeats >= 32 ? 'LOBBY FULL' : `${32 - event.bookedSeats} SEATS REMAINING`}
                                </span>
                                <span className="seats-total">{event.bookedSeats} / 32 BOOKED</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${(event.bookedSeats / 32) * 100}%` }}></div>
                            </div>
                        </div>
                    )}

                    <button
                        className={`register-btn-large btn-style-${event.color} blink-text-subtle`}
                        onClick={() => setIsModalOpen(true)}
                        disabled={event.id === 'e-football' && event.bookedSeats >= 32}
                        style={{ opacity: event.id === 'e-football' && event.bookedSeats >= 32 ? 0.5 : 1, cursor: event.id === 'e-football' && event.bookedSeats >= 32 ? 'not-allowed' : 'pointer' }}
                    >
                        {event.id === 'e-football' && event.bookedSeats >= 32 ? 'LOBBY FULL' : 'INITIATE REGISTRATION'}
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
