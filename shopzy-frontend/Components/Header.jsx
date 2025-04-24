import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../Styles/header.css';

const Header = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">Shopzy</Link>
            </div>
            <div className="header-center">
                <input
                    type="text"
                    placeholder="Search for products..."
                    className="search-bar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
            <div className="header-right">
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                )}
                <Link to="/">Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
            </div>
        </header>
    );
};

export default Header;
