import React, { useState, useMemo, useEffect } from 'react';
import api from '../../utils/axios';

const AdminWinners = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminType, setAdminType] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [prizeFilter, setPrizeFilter] = useState('ALL');

  const [selectedReg, setSelectedReg] = useState(null); // used for prize modal
  const [pendingPrize, setPendingPrize] = useState('');  // '1st Prize' | '2nd Prize' | 'None'
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

    if (prizeFilter !== 'ALL') {
      filtered = filtered.filter(r => (r.prize || 'None') === prizeFilter);
    }

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(reg =>
        reg.eventName?.toLowerCase().includes(lower) ||
        (Array.isArray(reg.playerName)
          ? reg.playerName.join(' ').toLowerCase().includes(lower)
          : reg.playerName?.toLowerCase().includes(lower)) ||
        reg.teamName?.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [registrations, searchQuery, prizeFilter]);

  const openPrizeModal = (reg) => {
    setSelectedReg(reg);
    setPendingPrize(reg.prize || 'None');
  };

  const closePrizeModal = () => {
    if (isProcessing) return;
    setSelectedReg(null);
    setPendingPrize('');
  };

  const confirmPrize = async () => {
    if (!selectedReg || !pendingPrize) return;
    setIsProcessing(true);
    try {
      await api.put(`/prize/${selectedReg._id}`, { prize: pendingPrize });
      setRegistrations(prev =>
        prev.map(r => r._id === selectedReg._id ? { ...r, prize: pendingPrize } : r)
      );
      closePrizeModal();
    } catch (err) {
      console.error('Error updating prize:', err);
      alert('Failed to update prize');
    } finally {
      setIsProcessing(false);
    }
  };

  const prizeColor = (prize) => {
    if (prize === '1st Prize') return 'var(--arcade-yellow)';
    if (prize === '2nd Prize') return 'var(--arcade-blue)';
    return '#555';
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
        <h2 className="tab-title text-arcade-yellow">🏆 WINNERS BOARD</h2>
        <div className="filter-controls">
          <div className="search-box">
            <span className="search-icon">&gt;</span>
            <input
              type="text"
              className="pixel-input search-input"
              placeholder="SEARCH PLAYERS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="pixel-input filter-select"
            value={prizeFilter}
            onChange={(e) => setPrizeFilter(e.target.value)}
          >
            <option value="ALL">ALL ENTRIES</option>
            <option value="1st Prize">1ST PRIZE</option>
            <option value="2nd Prize">2ND PRIZE</option>
            <option value="None">NO PRIZE</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="pixel-table">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>NO</th>
              <th style={{ width: '22%' }}>STAGE LOG</th>
              <th style={{ width: '28%' }}>OPERATOR</th>
              <th style={{ width: '20%' }}>TEAM NAME</th>
              <th style={{ whiteSpace: 'nowrap', width: '15%', textAlign: 'center' }}>PRIZE</th>
              <th style={{ whiteSpace: 'nowrap', width: '10%', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#555' }}>
                  NO RECORDS FOUND
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg, idx) => (
                <tr key={reg._id}>
                  <td>#{idx + 1}</td>
                  <td className="text-arcade-pink">{reg.eventName}</td>
                  <td>{Array.isArray(reg.playerName) ? reg.playerName[0] : reg.playerName}</td>
                  <td style={{ color: '#aaa' }}>{reg.teamName || '—'}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: prizeColor(reg.prize || 'None') }}>
                    {reg.prize || 'None'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="pixel-btn blink-text-subtle"
                      style={{ background: 'var(--arcade-yellow)', color: '#000', border: '2px solid #fff', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                      onClick={() => openPrizeModal(reg)}
                    >
                      [PRIZE]
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Prize Assignment Modal */}
      {selectedReg && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="modal-content pixel-border" style={{ position: 'relative', backgroundColor: '#0a0a0a', padding: '30px', maxWidth: '480px', width: '90%', borderColor: 'var(--arcade-yellow)' }}>

            <button
              className="pixel-btn-text text-arcade-pink"
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              onClick={closePrizeModal}
            >
              [X]
            </button>

            <h3 className="text-arcade-yellow" style={{ borderBottom: '2px dashed var(--arcade-yellow)', paddingBottom: '15px', marginTop: 0, paddingRight: '40px' }}>
              🏆 ASSIGN PRIZE
            </h3>

            <div style={{ marginBottom: '20px', fontSize: '1rem', lineHeight: '1.8', color: '#ccc' }}>
              <div><strong className="text-arcade-yellow">EVENT:</strong> {selectedReg.eventName}</div>
              <div><strong className="text-arcade-yellow">PLAYER:</strong> {Array.isArray(selectedReg.playerName) ? selectedReg.playerName.join(' | ') : selectedReg.playerName}</div>
              {selectedReg.teamName && (
                <div><strong className="text-arcade-yellow">TEAM:</strong> {selectedReg.teamName}</div>
              )}
              <div><strong className="text-arcade-yellow">CURRENT PRIZE:</strong> <span style={{ color: prizeColor(selectedReg.prize || 'None') }}>{selectedReg.prize || 'None'}</span></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
              {['1st Prize', '2nd Prize', 'None'].map(option => (
                <button
                  key={option}
                  onClick={() => setPendingPrize(option)}
                  style={{
                    background: pendingPrize === option ? prizeColor(option) : '#111',
                    color: pendingPrize === option ? '#000' : prizeColor(option),
                    border: `2px solid ${prizeColor(option)}`,
                    padding: '12px 20px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    transition: 'all 0.15s'
                  }}
                >
                  {option === 'None' ? '✕ REMOVE PRIZE' : option === '1st Prize' ? '🥇 1ST PRIZE' : '🥈 2ND PRIZE'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                className="pixel-btn"
                style={{ background: '#333', color: '#fff', border: '2px solid #666', padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
                onClick={closePrizeModal}
                disabled={isProcessing}
              >
                CANCEL
              </button>
              <button
                className="pixel-btn blink-text-subtle"
                style={{ background: 'var(--arcade-yellow)', color: '#000', border: '2px solid #fff', padding: '10px 20px', fontSize: '0.85rem', cursor: isProcessing ? 'progress' : 'pointer', fontWeight: 'bold', opacity: isProcessing ? 0.6 : 1 }}
                onClick={confirmPrize}
                disabled={isProcessing}
              >
                {isProcessing ? 'SAVING...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWinners;
