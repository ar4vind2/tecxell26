import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';
import api from '../../utils/axios';

const AdminLoginPage = () => {
    const [credentials, setCredentials] = useState({
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // In a real application, consider using Context or a state management library for auth state.
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error when user types
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError('');

        try {
            console.log(credentials);
            const response = await api.post('/adminLogin', credentials);

            const { msg, token } = response.data;
            console.log(token);
            localStorage.setItem('token', token);
            setIsLoggingIn(false);
            navigate('/admin/dashboard');
        } catch (error) {
            setIsLoggingIn(false);
            setError('ACCESS DENIED: INVALID PASSCODE');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container pixel-border">
                <div className="admin-header">
                    <h1 className="pixel-text-shadow-blue">SYSTEM_ADMIN</h1>
                    <p className="admin-subtitle blink-text">RESTRICTED ACCESS AREA</p>
                </div>

                <form className="admin-form" onSubmit={handleLogin}>
                    {error && (
                        <div className="admin-error-box">
                            <span className="error-icon">!</span>
                            {error}
                        </div>
                    )}

                    <div className="admin-form-group">
                        <label>SECURITY PASSCODE</label>
                        <input
                            type="password"
                            name="password"
                            className="admin-input"
                            placeholder="███████████"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-submit-btn"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? 'AUTHENTICATING...' : 'INITIALIZE LOGIN'}
                    </button>
                </form>

                <div className="admin-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span>UNAUTHORIZED ACCESS WILL BE LOGGED</span>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="pixel-btn-text text-arcade-yellow mt-2"
                        style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '10px' }}
                    >
                        [&lt;  RETURN TO BASE ]
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
