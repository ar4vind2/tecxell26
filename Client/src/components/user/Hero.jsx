import './Hero.css';
import Countdown from './Countdown';

const Hero = () => {
    return (
        <section className="hero-section" id="hero">
            <div className="hero-scanlines"></div>
            <div className="container hero-content-wrapper">
                <div className="hero-content pixel-border" data-aos="zoom-in" data-aos-duration="1500">
                    <h1 className="hero-main-title pixel-text-shadow">TECXELL '26</h1>

                    <p className="techfest-date blink-text mt-4">
                        MAR 18 • 2026 | INSERT COIN TO PLAY
                    </p>

                    <Countdown targetDate="2026-03-18T00:00:00" />

                    <div className="cta-wrapper mt-5">
                        <a href="#events" className="pixel-btn btn-style-red pixel-text-shadow">START ADVENTURE</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
