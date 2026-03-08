import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import Home from './components/Home';
import ContactPage from './components/user/ContactPage';
import EventDetailsPage from './components/user/EventDetailsPage';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ScrollToTop from './components/user/ScrollToTop';
import LoadingScreen from './components/user/LoadingScreen';

import TicketPage from './components/user/TicketPage';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="app">
          {/* 8-Bit Starfield Background */}
          <div className="starfield">
            <div className="stars"></div>
            <div className="stars2"></div>
          </div>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/ticket/:id" element={<TicketPage />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
