import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">Shopzy</Link>
            </div>
            <div className="header-center">
                <input type="text" placeholder="Search for products..." className="search-bar" />
                <button className="search-button">Search</button>
            </div>
            <div className="header-right">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/cart">Cart</Link>
            </div>
        </header>
    );
};

export default Header;
