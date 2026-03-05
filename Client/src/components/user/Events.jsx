import { Link } from 'react-router-dom';
import { eventsData } from '../../data/eventsData';
import './Events.css';

const Events = () => {
    return (
        <section className="events-section container" id="events">
            <div className="section-title">
                <h2 className="techfest-heading glitch" data-text="COMPETITIONS">COMPETITIONS</h2>
            </div>

            <div className="events-grid">
                {eventsData.map((event) => (
                    <div
                        key={event.id}
                        className={`event-card pixel-border card-${event.color}`}
                        data-aos="fade-up"
                    >
                        <div className="card-header">
                            <span className="stage-label">MISSION {event.stageNumber}</span>
                            <span className="points-label">{event.points}</span>
                        </div>

                        <div className="card-icon-wrapper">
                            <img src={event.icon} alt={event.title} className="event-icon-img" />
                        </div>

                        <h3 className="event-title pixel-text-shadow-blue">{event.title}</h3>

                        <p className="event-desc">{event.description}</p>

                        <div className="card-footer">
                            <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                                <button className={`pixel-btn btn-style-${event.color} w-100 pixel-text-shadow`}>EXPLORE</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Events;
