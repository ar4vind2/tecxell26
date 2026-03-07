import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCommsLog from './AdminCommsLog';
import AdminMissionControl from './AdminMissionControl';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('data'); // 'data' or 'timer'

    const handleLogout = () => {
        console.log('User logging out...');
        localStorage.removeItem('token');
        navigate('/admin');
        alert('Logged out successfully!');
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
                {activeTab === 'data' && <AdminCommsLog />}
                {activeTab === 'timer' && <AdminMissionControl />}
            </div>
        </div>
    );
};

export default AdminDashboard;
