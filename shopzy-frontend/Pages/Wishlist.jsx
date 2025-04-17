import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import '../Styles/wishlist.css';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlistItems = async () => {
            const token = localStorage.getItem('token');
            console.log('Wishlist component loaded');
            console.log('Token:', token);

            try {
                if (token) {
                    // Fetch wishlist from backend if logged in
                    const response = await axios.get('http://localhost:5004/wishlist/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log('Wishlist from backend:', response.data);
                    setWishlistItems(Array.isArray(response.data.items) ? response.data.items : []);

                } else {
                    // Fetch wishlist from localStorage if not logged in
                    const wishlistRaw = localStorage.getItem('wishlist');
                    console.log('Raw wishlist from localStorage:', wishlistRaw);

                    const storedWishlistItems = JSON.parse(wishlistRaw);
                    console.log('Parsed wishlist:', storedWishlistItems);

                    setWishlistItems(Array.isArray(storedWishlistItems) ? storedWishlistItems : []);
                }
            } catch (err) {
                console.error('Error fetching wishlist:', err);
                setError('Failed to fetch wishlist items');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistItems();
    }, []);

    const handleRemoveItem = (productId) => {
        const token = localStorage.getItem('token');

        if (token) {
            // Remove item from backend wishlist if logged in
            axios.delete(`http://localhost:5004/wishlist/remove/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
                })
                .catch(() => {
                    setError('Failed to remove item from wishlist');
                });
        } else {
            // Remove item from localStorage if not logged in
            const storedWishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
            const updatedWishlistItems = storedWishlistItems.filter(item => item._id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlistItems));
            setWishlistItems(updatedWishlistItems);
        }
    };

    const handleAddToCart = (product) => {
        const token = localStorage.getItem('token');

        if (token) {
            // Add to backend cart
            axios.post('http://localhost:5004/cart/add', { productId: product._id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    handleRemoveItem(product._id); // Remove from wishlist after adding
                })
                .catch(() => {
                    setError('Failed to add item to cart');
                });
        } else {
            // Add to localStorage cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem('cart', JSON.stringify(cart));

            handleRemoveItem(product._id); // Remove from wishlist after adding
        }
    };

    return (
        <div className="wishlist-container">

            <div className="wishlist-main">
                {loading ? (
                    <p>Loading wishlist...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div>
                        <h2>Your Wishlist</h2>
                        {wishlistItems.length === 0 ? (
                            <p>Your wishlist is empty!</p>
                        ) : (
                            wishlistItems.map(item => (
                                <div key={item._id} className="wishlist-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="wishlist-item-info">
                                        <h4>{item.name}</h4>
                                        <p>${item.price}</p>
                                        <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                                        <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Wishlist;
