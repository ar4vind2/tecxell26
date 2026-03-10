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
    const [showPassword, setShowPassword] = useState(false);

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
            const response = await api.post('/adminLogin', credentials);

            const { msg, token } = response.data;
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
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="admin-input"
                                placeholder="███████████"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setShowPassword(prev => !prev)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
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
