import React, { useState, useEffect } from 'react';
import Header from './user/Header';
import Hero from './user/Hero';
import About from './user/About';
import Events from './user/Events';
import Footer from './user/Footer';
import UrgencyMessage from './user/UrgencyMessage';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const Home = () => {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;

            // Check if we are within 50px of the bottom (footer area)
            if (windowHeight + scrollTop >= documentHeight - 50) {
                setIsAtBottom(true);
            } else {
                setIsAtBottom(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Initial check on load
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <UrgencyMessage />
            <Header />
            <Hero />
            <About />
            <Events />
            <Footer />

            <button
                onClick={isAtBottom ? scrollToTop : scrollToBottom}
                className="blink-text-subtle"
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--arcade-blue)',
                    color: '#000',
                    border: '3px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    zIndex: 1000,
                    boxShadow: '0 6px 12px rgba(0,0,0,0.5)',
                    padding: 0,
                    clipPath: 'none'
                }}
                aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
            >
                {isAtBottom ? <FaArrowUp style={{ marginTop: '0px' }} /> : <FaArrowDown style={{ marginTop: '3px' }} />}
            </button>
        </div>
    );
};

export default Home;
