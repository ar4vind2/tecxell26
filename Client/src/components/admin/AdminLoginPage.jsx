import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: '',
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

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError('');

        // Fake authentication logic for demonstration
        setTimeout(() => {
            if (credentials.username === 'admin' && credentials.password === 'tecxell26') {
                // Successful login
                setIsLoggingIn(false);
                navigate('/admin/dashboard');
            } else {
                // Failed login
                setIsLoggingIn(false);
                setError('ACCESS DENIED: INVALID CREDENTIALS');
            }
        }, 400);
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
                        <label>OPERATOR ID</label>
                        <input
                            type="text"
                            name="username"
                            className="admin-input"
                            placeholder="ENTER USERNAME"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

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

                <div className="admin-footer">
                    UNAUTHORIZED ACCESS WILL BE LOGGED
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
