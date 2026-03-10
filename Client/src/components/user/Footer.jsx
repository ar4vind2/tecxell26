import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="arcade-footer">
            <div className="footer-grid container">
                <div className="footer-col">
                    <h3 className="footer-logo pixel-text-shadow-blue">TECXELL '26</h3>
                    <p className="footer-tagline">LEVEL UP YOUR TECH JOURNEY</p>
                </div>

                <div className="footer-col">
                    <h4 className="footer-heading">SYS_LINKS</h4>
                    <ul className="footer-links">
                        <li><Link to="/" className="hover-blink">1. HOME_SYS</Link></li>
                        <li><a href="#events" className="hover-blink">2. STAGES</a></li>
                        <li><Link to="/contact" className="hover-blink">3. COMM-LINK</Link></li>
                        <li><Link to="/admin" className="hover-blink text-arcade-red" style={{ marginTop: '15px', display: 'inline-block' }}>4. [ ADMIN_LOGIN ]</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>CREDIT &copy; 2026 TECXELL MEDIA TEAM. GAME OVER.</p>
            </div>
        </footer>
    );
};

export default Footer;
