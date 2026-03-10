import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import api from '../../utils/axios';
import './TicketPage.css';

const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const getRegistration = async () => {
      try {
        // Determine base URL dynamically (for prod vs local dev)
        const response = await api.get(`/registration/${id}`);

        const data = response.data;
        setRegistration(data.registration);
        setEventDetails(data.event);

        console.log(registration);
        console.log(eventDetails);


      } catch (err) {
        console.error(err);
        setError('UNABLE TO RETRIEVE TICKET DATA');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getRegistration();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      setGenerating(true);
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // High resolution
        backgroundColor: '#1a1a2e', // Match theme background
        useCORS: true,
        logging: false
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');

      // Determine the safe name, handling array or string
      let firstName = 'Player';
      if (Array.isArray(registration.playerName) && registration.playerName.length > 0) {
        firstName = registration.playerName[0];
      } else if (typeof registration.playerName === 'string') {
        firstName = registration.playerName;
      }

      link.download = `Tecxell26_Ticket_${firstName}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('Error generating ticket image:', err);
      alert('Failed to generate ticket image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="ticket-page-container">
        <div className="glitch-text text-arcade-yellow" data-text="LOADING TICKET...">LOADING TICKET...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-page-container flex-col">
        <div className="pixel-border border-red p-4 text-center">
          <h2 className="text-arcade-red blink-text">ERROR</h2>
          <p className="mt-3">{error}</p>
          <button className="pixel-btn btn-style-pink mt-4" onClick={() => navigate('/')}>RETURN TO BASE</button>
        </div>
      </div>
    );
  }

  if (!registration) return null;

  // Generate a visual hash for the "barcode" effect
  const barcodeBlocks = Array.from({ length: 45 }).map((_, i) => (
    <div key={i} className="barcode-bar" style={{
      width: `${Math.random() * 4 + 1}px`,
      opacity: Math.random() > 0.3 ? 1 : 0
    }}></div>
  ));

  return (
    <div className="ticket-page-container pt-5">
      <h1 className="techfest-heading glitch text-center mb-5 mt-5" data-text="ACCESS PASS">ACCESS PASS</h1>

      <div className="ticket-wrapper">
        {/* The element we will screenshot */}
        <div className="retro-ticket pixel-border" ref={ticketRef}>
          <div className="ticket-header">
            <div className="ticket-logo">TECXELL '26</div>
            <div className="ticket-id">#{registration._id.substring(registration._id.length - 4).toUpperCase()}</div>
          </div>

          <div className="ticket-body">
            <div className="ticket-event-section pixel-border border-blue">
              <h2 className={`event-name text-arcade-${eventDetails?.color || 'pink'}`}>
                {registration.eventName}
              </h2>
              {eventDetails && (
                <p className="event-desc">{eventDetails.description}</p>
              )}
            </div>

            <div className="ticket-details-grid">
              <div className="detail-box">
                <label className="text-arcade-yellow">PLAYER ID</label>
                <div className="detail-value">
                  {Array.isArray(registration.playerName) ? registration.playerName[0] : registration.playerName}
                </div>
              </div>

              {registration.teamName && (
                <div className="detail-box">
                  <label className="text-arcade-yellow">SQUAD</label>
                  <div className="detail-value">{registration.teamName}</div>
                </div>
              )}

              <div className="detail-box">
                <label className="text-arcade-cyan">SCHEDULE</label>
                <div className="detail-value">{eventDetails?.schedule || 'TBA'}</div>
              </div>

              <div className="detail-box">
                <label className="text-arcade-pink">VENUE</label>
                <div className="detail-value">{eventDetails?.loc || 'MITS CAMPUS'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-actions mt-5 d-flex flex-column align-items-center gap-3">
        <button
          className="pixel-btn btn-style-green pixel-text-shadow w-100 max-w-sm"
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? 'GENERATING...' : 'DOWNLOAD PASS'}
        </button>

        <button
          className="pixel-btn btn-style-pink pixel-text-shadow w-100 max-w-sm"
          onClick={() => navigate('/')}
        >
          RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default TicketPage;
