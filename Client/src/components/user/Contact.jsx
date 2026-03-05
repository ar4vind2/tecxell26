import './Contact.css';

const Contact = () => {
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const message = e.target.message.value;

        // Construct email body
        const subject = encodeURIComponent(`Tecxell '26 Query from ${name}`);
        const body = encodeURIComponent(`Player Name: ${name}\nPlayer Email: ${email}\n\nMessage:\n${message}`);

        // Open default mail client
        window.location.href = `mailto:computex@mgits.ac.in?subject=${subject}&body=${body}`;

        e.target.reset();
    };

    return (
        <section className="contact-section container" id="contact">
            <div className="section-title">
                <h2 className="techfest-heading glitch" data-text="CONTACT US">CONTACT US</h2>
            </div>

            <div className="contact-grid">
                {/* Email Form Panel */}
                <div className="contact-panel pixel-border" data-aos="fade-right">
                    <div className="panel-header">
                        <span>SEND MESSAGE</span>
                        <span className="blink-text text-arcade-green">ONLINE</span>
                    </div>
                    <form className="contact-form" onSubmit={handleEmailSubmit}>
                        <div className="form-group mt-3">
                            <label htmlFor="name">PLAYER ID_</label>
                            <input type="text" id="name" required className="pixel-input" placeholder="ENTER NAME" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">COMMS RELAY_</label>
                            <input type="email" id="email" required className="pixel-input" placeholder="ENTER EMAIL" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">DATA LOG_</label>
                            <textarea id="message" rows="4" required className="pixel-input" placeholder="TYPE MESSAGE HERE..."></textarea>
                        </div>
                        <button type="submit" className="pixel-btn btn-style-blue w-100 mt-4 pixel-text-shadow">
                            START TRANSMISSION
                        </button>
                    </form>
                </div>

                {/* Coordinators & Map Panel */}
                <div className="info-panel" data-aos="fade-left">
                    <div className="coordinators-card pixel-border">
                        <div className="panel-header">
                            <span>GAME MASTERS</span>
                            <span className="text-arcade-green">ACTIVE</span>
                        </div>
                        <div className="coordinator-list mt-3">
                            <div className="coordinator">
                                <span className="coord-name">NEBIN KURIAKOSE</span>
                                <span className="coord-role text-arcade-cyan">LEAD COORDINATOR</span>
                                <a href="tel:+919876543210" className="coord-phone">+91 9207513904</a>
                            </div>
                            <div className="coordinator">
                                <span className="coord-name">WILL UPDATE</span>
                                <span className="coord-role text-arcade-pink">OPERATIONS</span>
                                <a href="tel:+919876543211" className="coord-phone">+91 ***********</a>
                            </div>
                        </div>
                    </div>

                    <div className="map-card pixel-border mt-4">
                        <div className="panel-header">
                            <span>MITS BASE CAMP</span>
                        </div>
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.639580634657!2d76.40587447479311!3d9.963914790139675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0874de563bc58b%3A0xde7ecbfa110cfbda!2sMuthoot%20Institute%20of%20Technology%20%26%20Science!5e0!3m2!1sen!2sin!4v1771739972088!5m2!1sen!2sin"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="MITS Location Map"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
