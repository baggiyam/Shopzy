import React from 'react';
import '../Styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Shopzy. All rights reserved.</p>
            <div className="footer-links">
                <a href="/">Privacy Policy</a>
                <a href="/">Terms of Service</a>
                <a href="/">Contact Us</a>
            </div>
        </footer>
    );
};

export default Footer;
