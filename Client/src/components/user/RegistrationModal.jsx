import React, { useState } from 'react';
import { eventsData } from '../../data/eventsData';
import api from '../../utils/axios';
import './RegistrationModal.css';

const RegistrationModal = ({ eventId, eventTitle, eventColor, isTeamEvent, onClose, onSubmit }) => {

    // Evaluate event flags
    const isEFootball = eventId === 'e-football';
    const isReelMaking = eventId === 'reel-making';
    const isTreasureHunt = eventId === 'treasure-hunt';
    const isVibeCoding = eventId === 'vibe-coding';
    const isComputerQuiz = eventId === 'computer-quiz';
    const isMiniMilitia = eventId === 'mini-militia';

    const getInitialSquadSize = () => {
        if (isTreasureHunt) return 4;
        if (isReelMaking) return 3;
        if (isComputerQuiz) return 2;
        if (isMiniMilitia) return 1;
        if (isVibeCoding) return 1;
        return 1;
    };

    const [formData, setFormData] = useState({
        teamName: '',
        player1Name: '',
        player2Name: '',
        player3Name: '',
        player4Name: '',
        player5Name: '',
        email: '',
        phone: '',
        college: '',
        branch: '',
        squadSize: getInitialSquadSize(),
        transactionId: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const event = eventsData.find(e => e.id === eventId);
    // Use dynamic string path from eventsData.js directly
    const dynamicQr = event?.qrCode || '';

    // Field configuration flags
    const showTeamName = isTreasureHunt || isComputerQuiz || isReelMaking;
    const showSquadSizeSelect = isTeamEvent && !isMiniMilitia && !isComputerQuiz;

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
                    <option value="3">TRIO (3)</option>
                    <option value="4">SQUAD (4)</option>
                    <option value="5">PENTA (5)</option>
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const courseLower = formData.branch.toLowerCase().trim();
        const collegeLower = formData.college.toLowerCase().trim();

        // Course validation (No btech/mtech variations)
        if (/(b\s*\.?\s*tech|m\s*\.?\s*tech)/i.test(courseLower)) {
            setErrorMsg('ACCESS DENIED: B.Tech and M.Tech students are not permitted.');
            return;
        }

        // College validation (No MITS variations)
        if (/mits|muthoot/i.test(collegeLower)) {
            setErrorMsg('ACCESS DENIED: Participants from MITS are not permitted.');
            return;
        }

        setErrorMsg('');
        setIsSubmitting(true);

        // Helper to precisely match capitalization with Backend DB Schema enum
        const getExactEventName = (id) => {
            const map = {
                'vibe-coding': 'Vibe Coding',
                'reel-making': 'Reel Making',
                'poster-making': 'Poster Making',
                'computer-quiz': 'Computer Quiz',
                'mini-militia': 'Mini Miltia', // Must stay misspelled to match MongoDB schema
                'treasure-hunt': 'Treasure Hunt',
                'e-football': 'E-football'
            };
            return map[id] || eventTitle;
        };

        const activeSize = parseInt(formData.squadSize);
        let players = [];

        // Push players sequentially based on selected squad size
        if (formData.player1Name) players.push(formData.player1Name);
        if (formData.player2Name && activeSize >= 2) players.push(formData.player2Name);
        if (formData.player3Name && activeSize >= 3) players.push(formData.player3Name);
        if (formData.player4Name && activeSize >= 4) players.push(formData.player4Name);
        if (formData.player5Name && activeSize >= 5) players.push(formData.player5Name);

        const payload = {
            eventName: getExactEventName(eventId),
            playerName: players,
            teamName: formData.teamName || "",
            phone: formData.phone ? Number(formData.phone) : "",
            email: formData.email || "",
            college: formData.college || "",
            branch: formData.branch || "",
            transactionId: formData.transactionId || "",
            squadSize: players.length
        };

        try {
            await api.post('/registration', payload);

            setIsSubmitting(false);
            setIsSuccess(true);
            onSubmit(payload);
        } catch (error) {
            console.error('Registration failed:', error);
            setIsSubmitting(false);
            setErrorMsg(error.response?.data?.message || 'ERROR: FAILED TO CONNECT TO SECURE SERVER.');
        }
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

                        {showTeamName && (
                            <div className="form-group">
                                <label>TEAM NAME</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    className="pixel-input"
                                    placeholder="ENTER TEAM NAME..."
                                    value={formData.teamName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>{showTeamName ? 'TEAM LEADER NAME' : 'PLAYER NAME'}</label>
                            <input
                                type="text"
                                name="player1Name"
                                className="pixel-input"
                                placeholder={showTeamName ? "ENTER LEADER ALIAS..." : "ENTER ALIAS..."}
                                value={formData.player1Name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>COMM-LINK (EMAIL)</label>
                            <input
                                type="email"
                                name="email"
                                className="pixel-input"
                                placeholder="ENTER EMAIL..."
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>DIRECT LINE (PHONE)</label>
                            <input
                                type="tel"
                                name="phone"
                                className="pixel-input"
                                placeholder="ENTER NUMBER..."
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>COLLEGE NAME</label>
                            <input
                                type="text"
                                name="college"
                                className="pixel-input"
                                placeholder="ENTER COLLEGE NAME..."
                                value={formData.college}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>COURSE / DEGREE</label>
                            <input
                                type="text"
                                name="branch"
                                className="pixel-input"
                                placeholder="ENTER COURSE..."
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {showSquadSizeSelect && (
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

                        {parseInt(formData.squadSize) >= 2 && (
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

                        {parseInt(formData.squadSize) >= 3 && (
                            <div className="form-group">
                                <label>PLAYER 3 NAME</label>
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

                        {parseInt(formData.squadSize) >= 4 && (
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

                        {parseInt(formData.squadSize) >= 5 && (
                            <div className="form-group">
                                <label>PLAYER 5 NAME</label>
                                <input
                                    type="text"
                                    name="player5Name"
                                    className="pixel-input"
                                    placeholder="ENTER 5TH ALIAS..."
                                    value={formData.player5Name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="payment-section">
                            <h3 className="payment-title">PAYMENT VERIFICATION</h3>
                            <div className="qr-container">
                                <div className="qr-crop-box">
                                    <img
                                        src={dynamicQr || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=techfest@upi&pn=Tecxell2026&cu=INR"}
                                        alt="Payment QR Code"
                                        className="qr-code-img"
                                    />
                                </div>
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
