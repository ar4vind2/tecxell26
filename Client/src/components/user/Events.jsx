import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsData } from '../../data/eventsData';
import api from '../../utils/axios';
import './Events.css';

// Map eventsData id → DB event name
const eventIdToDbName = {
    'vibe-coding': 'Vibe Coding',
    'reel-making': 'Reel Making',
    'poster-making': 'Poster Making',
    'computer-quiz': 'Computer Quiz',
    'mini-militia': 'Mini Miltia',
    'treasure-hunt': 'Treasure Hunt',
    'e-football': 'E-football',
};

const statusColors = {
    'Yet to start': '#888',
    'In Progress': 'var(--arcade-green)',
    'Delayed': 'var(--arcade-yellow)',
    'Completed': 'var(--arcade-blue)',
};

const Events = () => {
    const [eventStatuses, setEventStatuses] = useState({});

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const res = await api.get('/eventsStatus');
                const statusMap = {};
                (res.data.events || []).forEach(e => {
                    statusMap[e.name] = e.currentSts;
                });
                setEventStatuses(statusMap);
            } catch (err) {
                // silently fail — status badges just won't show
            }
        };
        fetchStatuses();
    }, []);

    return (
        <section className="events-section container" id="events">
            <div className="section-title">
                <h2 className="techfest-heading glitch" data-text="COMPETITIONS">COMPETITIONS</h2>
            </div>

            <div className="events-grid">
                {eventsData.map((event) => {
                    const dbName = eventIdToDbName[event.id];
                    const status = dbName ? eventStatuses[dbName] : null;
                    const statusColor = status ? statusColors[status] : null;

                    return (
                        <div
                            key={event.id}
                            className={`event-card pixel-border card-${event.color}`}
                            data-aos="fade-up"
                        >
                            <div className="card-header">
                                <span className="stage-label">MISSION {event.stageNumber}</span>
                                {status && (
                                    <span className="event-status-badge" style={{ color: statusColor, borderColor: statusColor }}>
                                        ● {status.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="card-icon-wrapper">
                                <img src={event.icon} alt={event.title} className="event-icon-img" />
                            </div>


                            <h3 className="event-title pixel-text-shadow">{event.title}</h3>


                            <p className="event-desc">{event.description}</p>

                            <div className="card-footer">
                                <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', width: '100%' }}>

                                    <button className={`pixel-btn btn-style-${event.color} w-100 pixel-text-shadow`} style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.5)' }}>EXPLORE</button>

                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Events;

