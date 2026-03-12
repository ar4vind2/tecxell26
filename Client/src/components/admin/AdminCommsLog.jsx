import React, { useState, useMemo, useRef, useEffect } from 'react';
import api from '../../utils/axios';
import { eventsData } from '../../data/eventsData';

const AdminCommsLog = () => {
    const tableContainerRef = useRef(null);

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [adminType, setAdminType] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [filterVerify, setFilterVerify] = useState('ALL');
    const [selectedReg, setSelectedReg] = useState(null);
    const [verificationAction, setVerificationAction] = useState(null); // stores { id, actionType } pending confirmation
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await api.get('/registrationData');

                setRegistrations(Array.isArray(response.data.registrations) ? response.data.registrations : []);
                setAdminType(response.data.adminType || '');

            } catch (err) {
                console.error('Error fetching registrations:', err);
                setError('Failed to load registration data');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    const filteredRegistrations = useMemo(() => {
        if (!Array.isArray(registrations)) return [];

        let filtered = registrations;

        if (filterVerify === 'VERIFIED') {
            filtered = filtered.filter(r => r.verified === 'Verified');
        } else if (filterVerify === 'PENDING') {
            filtered = filtered.filter(r => r.verified === 'Pending');
        } else if (filterVerify === 'REJECTED') {
            filtered = filtered.filter(r => r.verified === 'Rejected');
        }

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            filtered = filtered.filter(reg =>
                reg._id.toLowerCase().includes(lower) ||
                reg.eventName.toLowerCase().includes(lower) ||
                (Array.isArray(reg.playerName) ? reg.playerName.join(' ').toLowerCase().includes(lower) : reg.playerName.toLowerCase().includes(lower)) ||
                reg.feeSts.toLowerCase().includes(lower)
            );
        }
        return filtered;
    }, [registrations, searchQuery, filterVerify]);

    const handleVerifyAction = (id) => {
        setVerificationAction({ id, actionType: 'VERIFY' });
    };

    const handleNotVerifyAction = (id) => {
        setVerificationAction({ id, actionType: 'NOT_VERIFY' });
    };

    const exportToCSV = () => {
        if (filteredRegistrations.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = ["Sl No", "Ticket ID", "Event Name", "Player Names", "Team Name", "Phone", "Email", "College", "Branch", "Transaction ID", "Squad Size", "Fee Amount", "Fee Status", "Verified Status", "Prize", "Date Registered"];

        const csvRows = [headers.join(',')];

        filteredRegistrations.forEach((reg, idx) => {
            const getExactEventFeeNumeric = (eventName) => {
                const normalized = (eventName || '').toLowerCase();
                const map = { 'mini miltia': 'mini-militia' };
                const idToSearch = map[normalized] || normalized.replace(/\s+/g, '-');
                const eventInfo = eventsData.find(e => e.id === idToSearch || e.title.toLowerCase() === normalized);
                if (!eventInfo) return 'N/A';
                // Extract just the numerical value from "Rs 50 Per Head" etc.
                const match = eventInfo.fee.match(/\d+/);
                return match ? match[0] : 'N/A';
            };
            const feeAmount = getExactEventFeeNumeric(reg.eventName);
            const row = [
                idx + 1,
                `"#${(reg._id || '').slice(-4).toUpperCase()}"`,
                `"${reg.eventName || ''}"`,
                `"${Array.isArray(reg.playerName) ? reg.playerName.join(' | ') : (reg.playerName || '')}"`,
                `"${reg.teamName || ''}"`,
                `"${reg.phone || ''}"`,
                `"${reg.email || ''}"`,
                `"${reg.college || ''}"`,
                `"${reg.branch || ''}"`,
                `"${reg.transactionId || ''}"`,
                reg.squadSize || (Array.isArray(reg.playerName) ? reg.playerName.length : 1),
                `"${feeAmount}"`,
                `"${reg.feeSts || ''}"`,
                `"${reg.verified || ''}"`,
                `"${reg.prize || 'None'}"`,
                `"${new Date(reg.createdAt).toLocaleString()}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `tecxell_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const confirmVerification = async () => {
        if (!verificationAction) return;

        setIsProcessing(true);
        const { id, actionType } = verificationAction;
        try {
            if (actionType === 'VERIFY') {
                await api.put(`/registrationVerify/${id}`);
                setRegistrations(prev => prev.map(r => r._id === id ? { ...r, verified: 'Verified', feeSts: 'Paid' } : r));
            } else if (actionType === 'NOT_VERIFY') {
                await api.put(`/registrationReject/${id}`);
                setRegistrations(prev => prev.map(r => r._id === id ? { ...r, verified: 'Rejected', feeSts: 'Pending' } : r));
            }
            setSelectedReg(null); // Close the detail modal
            setVerificationAction(null); // Close the confirmation modal
        } catch (err) {
            console.error('Error performing verification action:', err);
            alert('Failed to execute action');
            setVerificationAction(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelVerification = () => {
        if (isProcessing) return;
        setVerificationAction(null);
    };

    if (loading) {
        return (
            <div className="view-container">
                <div className="glitch-text text-arcade-yellow" data-text="LOADING DATA...">LOADING DATA...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-container">
                <div className="pixel-border border-red p-4 text-center">
                    <h2 className="text-arcade-red blink-text">ERROR</h2>
                    <p className="mt-3">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container">
            <div className="tab-header">
                <h2 className="tab-title text-arcade-blue">INCOMING TRANSMISSIONS</h2>
                <div className="filter-controls">
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
                    <select
                        className="pixel-input filter-select"
                        value={filterVerify}
                        onChange={(e) => setFilterVerify(e.target.value)}
                    >
                        <option value="ALL">VERIFICATION</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                    <button
                        className="pixel-btn blink-text-subtle export-btn"
                        onClick={exportToCSV}
                    >
                        [ EXPORT DATA ]
                    </button>
                </div>
            </div>

            <div className="table-wrapper" ref={tableContainerRef}>
                <table className="pixel-table">
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>NO</th>
                            <th style={{ width: '25%' }}>STAGE LOG</th>
                            <th style={{ width: '30%' }}>OPERATOR</th>
                            <th style={{ whiteSpace: 'nowrap', width: '15%', textAlign: 'center' }}>PAYMENT STATUS</th>
                            <th style={{ whiteSpace: 'nowrap', width: '15%', textAlign: 'center' }}>VERIFIED</th>
                            <th style={{ whiteSpace: 'nowrap', width: '10%', textAlign: 'center' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRegistrations.map((reg, idx) => {
                            const isRecent = reg.verified === 'Pending' && reg.createdAt && (new Date() - new Date(reg.createdAt) <= 12 * 60 * 60 * 1000);
                            return (
                                <tr key={reg._id} style={{ backgroundColor: isRecent ? 'rgba(173, 216, 230, 0.2)' : 'transparent' }}>
                                    <td>#{idx + 1}</td>
                                    <td className="text-arcade-pink">{reg.eventName}</td>
                                    <td>{Array.isArray(reg.playerName) ? reg.playerName[0] : reg.playerName}</td>
                                    <td className={reg.feeSts === 'Paid' ? 'text-arcade-green' : 'text-arcade-yellow'} style={{ textAlign: 'center' }}>
                                        {reg.feeSts}
                                    </td>
                                    <td className={reg.verified === 'Verified' ? 'text-arcade-green' : reg.verified === 'Rejected' ? 'text-arcade-red' : 'text-arcade-yellow'} style={{ textAlign: 'center' }}>
                                        {reg.verified}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className="pixel-btn blink-text-subtle"
                                            style={{ background: 'var(--arcade-red)', color: '#fff', border: '2px solid #fff', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer' }}
                                            onClick={() => setSelectedReg(reg)}
                                        >
                                            [VIEW]
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing registration details */}
            {selectedReg && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div className="modal-content pixel-border" style={{ position: 'relative', backgroundColor: '#0a0a0a', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>

                        <button
                            className="pixel-btn-text text-arcade-pink"
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 }}
                            onClick={() => setSelectedReg(null)}
                        >
                            [X]
                        </button>

                        <h3 className="text-arcade-pink mb-4" style={{ borderBottom: '2px solid #ff00ff', paddingBottom: '15px', marginTop: 0, paddingRight: '40px' }}>TRANSMISSION DATA</h3>

                        <style>
                            {`
                                @keyframes blinkTxn {
                                    50% { border-color: transparent; }
                                }
                                .blinking-border {
                                    border: 2px solid var(--arcade-yellow);
                                    animation: blinkTxn 1s step-end infinite;
                                    padding: 2px 6px;
                                    display: inline-block;
                                    margin-top: 4px;
                                }
                            `}
                        </style>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', fontSize: '1rem', lineHeight: '1.6' }}>
                            <div><strong className="text-arcade-yellow">SQUAD SIZE:</strong><br /> {selectedReg.squadSize || (Array.isArray(selectedReg.playerName) ? selectedReg.playerName.length : 1)}</div>
                            <div><strong className="text-arcade-yellow">STAGE LOG:</strong><br /> {selectedReg.eventName}</div>

                            <div><strong className="text-arcade-yellow">DATE:</strong><br /> {new Date(selectedReg.createdAt).toLocaleDateString()}</div>
                            <div><strong className="text-arcade-yellow">TIME:</strong><br /> {new Date(selectedReg.createdAt).toLocaleTimeString()}</div>

                            <div><strong className="text-arcade-yellow">PHONE NO:</strong><br /> <a href={`tel:${selectedReg.phone}`} className="text-arcade-blue hover-blink" style={{ textDecoration: 'underline' }}>{selectedReg.phone}</a></div>
                            <div><strong className="text-arcade-yellow">COLLEGE:</strong><br /> {selectedReg.college}</div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <strong className="text-arcade-yellow">TRANSACTION ID:</strong><br />
                                <span className="blinking-border">{selectedReg.transactionId}</span>
                            </div>

                            <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.05)', padding: '15px', borderLeft: '4px solid #00f0ff' }}>
                                <strong className="text-arcade-yellow">OPERATOR(S):</strong>
                                <br />
                                {Array.isArray(selectedReg.playerName) ? selectedReg.playerName.join(' | ') : selectedReg.playerName}
                            </div>
                        </div>

                        {['Superior Admin', 'Student Admin'].includes(adminType) && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '1rem' }}>
                                <button
                                    className="pixel-btn btn-style-red"
                                    style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                                    onClick={() => handleNotVerifyAction(selectedReg._id)}
                                >
                                    DON'T VERIFY
                                </button>
                                <button
                                    className="pixel-btn btn-style-green"
                                    style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                                    onClick={() => handleVerifyAction(selectedReg._id)}
                                >
                                    VERIFY
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {verificationAction && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                    <div className="modal-content pixel-border" style={{ backgroundColor: '#111', padding: '30px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h3 className="text-arcade-yellow mb-4" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>SYSTEM PROMPT</h3>
                        <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '30px', lineHeight: '1.5' }}>
                            Are you sure you want to mark this registration as
                            <strong className={verificationAction.actionType === 'VERIFY' ? 'text-arcade-green' : 'text-arcade-red'} style={{ margin: '0 5px' }}>
                                {verificationAction.actionType === 'VERIFY' ? 'VERIFIED' : 'PENDING'}
                            </strong>?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button
                                className="pixel-btn"
                                style={{ background: '#333', color: '#fff', border: '2px solid #666', padding: '10px 20px', fontSize: '0.9rem', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.5 : 1 }}
                                onClick={cancelVerification}
                                disabled={isProcessing}
                            >
                                CANCEL
                            </button>
                            <button
                                className={`pixel-btn ${!isProcessing ? 'blink-text-subtle' : ''}`}
                                style={{ background: verificationAction.actionType === 'VERIFY' ? 'var(--arcade-green)' : 'var(--arcade-red)', color: '#000', border: '2px solid #fff', padding: '10px 20px', fontSize: '0.9rem', cursor: isProcessing ? 'progress' : 'pointer', fontWeight: 'bold' }}
                                onClick={confirmVerification}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        PROCESSING <span className="blink-text">...</span>
                                    </span>
                                ) : 'CONFIRM'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCommsLog;
