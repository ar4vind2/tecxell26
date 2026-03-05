import TypewriterText from './TypewriterText';
import './About.css';

const About = () => {
    return (
        <section className="about-section container" id="about">
            <div className="dialog-box pixel-border" data-aos="fade-up">
                <div className="dialog-header">
                    <span className="npc-name">SYS_ADMIN</span>
                    <div className="window-controls">
                        <span className="control-btn close"></span>
                        <span className="control-btn max"></span>
                        <span className="control-btn min"></span>
                    </div>
                </div>

                <div className="dialog-body">
                    <div className="npc-portrait pixel-border">
                        <span style={{ fontSize: '4rem' }}>👾</span>
                    </div>

                    <div className="dialog-text">
                        <h3 className="about-title pixel-text-shadow-blue">THE ULTIMATE TECH EXPERIENCE</h3>
                        <div className="typewriter-container">
                            <TypewriterText
                                text="Step into the future with Tecxell '26, the premier national level technical symposium. A convergence of minds, innovation, and futuristic technology. Join us for coding, gaming, and hardcore networking with the brightest minds across the grid. Are you ready player one?"
                                delay={30}
                            />
                        </div>

                        <div className="stats-grid mt-4">
                            <div className="stat-box pixel-border">
                                <span className="stat-number">15+</span>
                                <span className="stat-label">MISSIONS</span>
                            </div>
                            <div className="stat-box pixel-border">
                                <span className="stat-number text-arcade-pink">50K+</span>
                                <span className="stat-label">PRIZE POOL</span>
                            </div>
                            <div className="stat-box pixel-border">
                                <span className="stat-number text-arcade-green">2</span>
                                <span className="stat-label">DAYS</span>
                            </div>
                        </div>

                        <div className="prompt-continue blink-text">
                            Press [ENTER] to continue...
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
