import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsData } from '../../data/eventsData';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('data'); // 'data' or 'timer'
    const tableContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({
                top: tableContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Mock registration data for the "Viewing Data" functionality
    const [registrations, setRegistrations] = useState([
        { id: '1001', event: 'MINI MILITIA', player: 'ShadowNinja', teamSize: 'SQUAD', status: 'PAID', time: '10:45 AM' },
        { id: '1002', event: 'VIBE CODING', player: 'NullPointer', teamSize: 'SOLO', status: 'PENDING', time: '11:15 AM' },
        { id: '1003', event: 'E-FOOTBALL', player: 'MessiFan99', teamSize: 'SOLO', status: 'PAID', time: '12:05 PM' }
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRegistrations = useMemo(() => {
        if (!searchQuery) return registrations;
        const lower = searchQuery.toLowerCase();
        return registrations.filter(reg =>
            reg.id.toLowerCase().includes(lower) ||
            reg.event.toLowerCase().includes(lower) ||
            reg.player.toLowerCase().includes(lower) ||
            reg.status.toLowerCase().includes(lower) ||
            reg.teamSize.toLowerCase().includes(lower)
        );
    }, [registrations, searchQuery]);

    // Local state for event statuses
    const [eventStatuses, setEventStatuses] = useState(
        eventsData.reduce((acc, event) => {
            acc[event.id] = 'YET TO START';
            return acc;
        }, {})
    );

    const handleStatusChange = (eventId, newStatus) => {
        setEventStatuses(prev => ({
            ...prev,
            [eventId]: newStatus
        }));
    };

    const handleLogout = () => {
        navigate('/admin');
    };

    return (
        <div className="admin-dashboard-page">
            <div className="admin-sidebar pixel-border border-blue">
                <div className="admin-profile">
                    <h2 className="pixel-text-shadow-blue">SYS_ADMIN</h2>
                    <p className="online-status blink-text">● ONLINE</p>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`admin-nav-item ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                    >
                        &gt; COMMS LOG (DATA)
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'timer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timer')}
                    >
                        &gt; MISSION CONTROL (EVENTS)
                    </button>
                    <button className="admin-nav-item logout" onClick={handleLogout}>
                        [ LOGOUT ]
                    </button>
                </nav>
            </div>

            <div className="admin-content-area pixel-border">
                <div className="mobile-rotate-warning blink-text text-arcade-red">
                    ⚠ ROTATE DEVICE FOR OPTIMAL VIEWING ⚠
                </div>
                {activeTab === 'data' && (
                    <div className="view-container">
                        <div className="tab-header">
                            <h2 className="tab-title text-arcade-blue">INCOMING TRANSMISSIONS</h2>
                            <div className="search-box">
                                <span className="search-icon">&gt;</span>
                                <input
                                    type="text"
                                    className="pixel-input search-input"
                                    placeholder="FILTER LOGS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-wrapper" ref={tableContainerRef}>
                            <button className="scroll-down-btn blink-text-subtle" onClick={scrollToBottom}>
                                ▼ SCROLL DOWN
                            </button>
                            <table className="pixel-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>STAGE LOG</th>
                                        <th>OPERATOR</th>
                                        <th>SQUAD</th>
                                        <th>FEE STATUS</th>
                                        <th>TIMESTAMP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistrations.map(reg => (
                                        <tr key={reg.id}>
                                            <td>#{reg.id}</td>
                                            <td className="text-arcade-pink">{reg.event}</td>
                                            <td>{reg.player}</td>
                                            <td>{reg.teamSize}</td>
                                            <td className={reg.status === 'PAID' ? 'text-arcade-green' : 'text-arcade-yellow'}>
                                                {reg.status}
                                            </td>
                                            <td>{reg.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'timer' && (
                    <div className="view-container">
                        <h2 className="tab-title text-arcade-yellow">MISSION TIMELINE STATUS</h2>
                        <div className="table-wrapper" ref={tableContainerRef}>
                            <button className="scroll-down-btn blink-text-subtle" onClick={scrollToBottom}>
                                ▼ SCROLL DOWN
                            </button>
                            <table className="pixel-table">
                                <thead>
                                    <tr>
                                        <th>MISSION (EVENT)</th>
                                        <th>LOCATION</th>
                                        <th>SCHEDULE</th>
                                        <th>CURRENT STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventsData.map(event => (
                                        <tr key={event.id}>
                                            <td className="text-arcade-blue font-bold">{event.title}</td>
                                            <td>{event.venue}</td>
                                            <td className="text-arcade-pink">{event.time}</td>
                                            <td>
                                                <span className={`status-badge stat-${eventStatuses[event.id].replace(/\s+/g, '-').toLowerCase()}`}>
                                                    {eventStatuses[event.id]}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="pixel-select"
                                                    value={eventStatuses[event.id]}
                                                    onChange={(e) => handleStatusChange(event.id, e.target.value)}
                                                >
                                                    <option value="YET TO START">YET TO START</option>
                                                    <option value="IN PROGRESS">IN PROGRESS</option>
                                                    <option value="DELAYED">DELAYED</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
