import Header from './Header'
import Contact from './Contact'
import Footer from './Footer'
import { useEffect } from 'react'

const ContactPage = () => {
    // Ensure the page scrolls to top when loading the new route
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <Contact />
            </div>
            <Footer />
        </>
    );
};

export default ContactPage;
