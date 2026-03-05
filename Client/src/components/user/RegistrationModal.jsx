import React, { useState } from 'react';
import './RegistrationModal.css';

const RegistrationModal = ({ eventId, eventTitle, eventColor, isTeamEvent, onClose, onSubmit }) => {
    const getInitialSquadSize = () => {
        if (eventId === 'treasure-hunt') return '4';
        return '1';
    };

    const [formData, setFormData] = useState({
        playerName: '',
        teamLeaderName: '',
        playerEmail: '',
        playerPhone: '',
        collegeName: '',
        course: '',
        squadSize: getInitialSquadSize(),
        player2Name: '',
        player3Name: '',
        player4Name: '',
        transactionId: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isEFootball = eventId === 'e-football';
    const isReelMaking = eventId === 'reel-making';
    const isTreasureHunt = eventId === 'treasure-hunt';
    const isVibeCoding = eventId === 'vibe-coding';

    const renderSquadSizeOptions = () => {
        if (isTreasureHunt) {
            return <option value="4">SQUAD (4 REQUIRED)</option>;
        }
        if (isVibeCoding) {
            return (
                <>
                    <option value="1">SOLO (1)</option>
                    <option value="2">DUO (2)</option>
                </>
            );
        }
        if (isReelMaking) {
            return (
                <>
                    <option value="1">SOLO (1)</option>
                    <option value="2">DUO (2)</option>
                    <option value="3">TRIO (3)</option>
                </>
            );
        }
        return (
            <>
                <option value="1">SOLO (1)</option>
                <option value="2">DUO (2)</option>
                <option value="3">TRIO (3)</option>
                <option value="4">SQUAD (4)</option>
            </>
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const courseLower = formData.course.toLowerCase().trim();
        const collegeLower = formData.collegeName.toLowerCase().trim();

        // Course validation (No btech/mtech variations)
        if (/(b\s*\.?\s*tech|m\s*\.?\s*tech)/i.test(courseLower)) {
            setErrorMsg('ACCESS DENIED: B.Tech and M.Tech students are not permitted.');
            return;
        }

        // College validation (No MITS variations)
        if (/(muthoot institute of technology and science|\bmits\b)/i.test(collegeLower)) {
            setErrorMsg('ACCESS DENIED: Participants from MITS are not permitted.');
            return;
        }

        setErrorMsg('');
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onSubmit(formData);
                onClose();
            }, 800);
        }, 400);
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-content pixel-border card-${eventColor}`}>
                <button className="close-btn" onClick={onClose}>X</button>

                <h2 className="modal-title pixel-text-shadow">
                    JOIN: {eventTitle}
                </h2>

                {errorMsg && (
                    <div className="error-message blink-text" style={{ color: 'var(--arcade-red)', marginBottom: '15px', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
                        {errorMsg}
                    </div>
                )}

                {isSuccess ? (
                    <div className="success-message blink-text text-arcade-green">
                        <p>TRANSMISSION RECEIVED.</p>
                        <p>REGISTRATION SUCCESSFUL.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="retro-form">
                        <div className="form-group">
                            <label>{isReelMaking ? 'TEAM NAME' : 'PLAYER NAME'}</label>
                            <input
                                type="text"
                                name="playerName"
                                className="pixel-input"
                                placeholder={isReelMaking ? 'ENTER TEAM NAME...' : 'ENTER ALIAS...'}
                                value={formData.playerName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isReelMaking && (
                            <div className="form-group">
                                <label>TEAM LEADER NAME</label>
                                <input
                                    type="text"
                                    name="teamLeaderName"
                                    className="pixel-input"
                                    placeholder="ENTER LEADER ALIAS..."
                                    value={formData.teamLeaderName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>COMM-LINK (EMAIL)</label>
                            <input
                                type="email"
                                name="playerEmail"
                                className="pixel-input"
                                placeholder="ENTER EMAIL..."
                                value={formData.playerEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>DIRECT LINE (PHONE)</label>
                            <input
                                type="tel"
                                name="playerPhone"
                                className="pixel-input"
                                placeholder="ENTER NUMBER..."
                                value={formData.playerPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>COLLEGE NAME</label>
                            <input
                                type="text"
                                name="collegeName"
                                className="pixel-input"
                                placeholder="ENTER COLLEGE NAME..."
                                value={formData.collegeName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>COURSE / DEGREE</label>
                            <input
                                type="text"
                                name="course"
                                className="pixel-input"
                                placeholder="ENTER COURSE..."
                                value={formData.course}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isTeamEvent && (
                            <div className="form-group">
                                <label>SQUAD SIZE</label>
                                <select
                                    name="squadSize"
                                    className="pixel-input"
                                    value={formData.squadSize}
                                    onChange={handleChange}
                                >
                                    {renderSquadSizeOptions()}
                                </select>
                            </div>
                        )}

                        {isTeamEvent && parseInt(formData.squadSize) >= 2 && !isReelMaking && (
                            <div className="form-group">
                                <label>PLAYER 2 NAME</label>
                                <input
                                    type="text"
                                    name="player2Name"
                                    className="pixel-input"
                                    placeholder="ENTER 2ND ALIAS..."
                                    value={formData.player2Name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {isTeamEvent && isReelMaking && parseInt(formData.squadSize) >= 2 && (
                            <div className="form-group">
                                <label>MEMBER 2 NAME</label>
                                <input
                                    type="text"
                                    name="player2Name"
                                    className="pixel-input"
                                    placeholder="ENTER 2ND ALIAS..."
                                    value={formData.player2Name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {isTeamEvent && parseInt(formData.squadSize) >= 3 && (
                            <div className="form-group">
                                <label>{isReelMaking ? 'MEMBER 3 NAME' : 'PLAYER 3 NAME'}</label>
                                <input
                                    type="text"
                                    name="player3Name"
                                    className="pixel-input"
                                    placeholder="ENTER 3RD ALIAS..."
                                    value={formData.player3Name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {isTeamEvent && parseInt(formData.squadSize) >= 4 && (
                            <div className="form-group">
                                <label>PLAYER 4 NAME</label>
                                <input
                                    type="text"
                                    name="player4Name"
                                    className="pixel-input"
                                    placeholder="ENTER 4TH ALIAS..."
                                    value={formData.player4Name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="payment-section">
                            <h3 className="payment-title">PAYMENT VERIFICATION</h3>
                            <div className="qr-container">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=techfest@upi&pn=Tecxell2026&cu=INR"
                                    alt="Payment QR Code"
                                    className="qr-code-img"
                                />
                                <p className="qr-instruction">SCAN TO PAY REGISTRATION FEE</p>
                            </div>

                            <div className="form-group">
                                <label>TRANSACTION ID</label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    className="pixel-input"
                                    placeholder="ENTER TXN REF NO..."
                                    value={formData.transactionId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn btn-style-${eventColor}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'UPLOADING...' : 'CONFIRM REGISTRATION'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegistrationModal;
