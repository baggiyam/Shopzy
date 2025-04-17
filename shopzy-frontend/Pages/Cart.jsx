import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../Styles/cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const syncLocalCartToBackend = async (localCart) => {
            try {
                for (const item of localCart) {
                    await axios.post('http://localhost:5004/cart/add', { productId: item._id }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
                // Clear local cart after syncing
                localStorage.removeItem('cart');
            } catch (err) {
                console.error('Error syncing local cart to backend:', err);
            }
        };

        const fetchCartItems = async () => {
            try {
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];

                if (token) {
                    // If user is logged in and local cart exists, sync it first
                    if (localCart.length > 0) {
                        await syncLocalCartToBackend(localCart);
                    }

                    // Then fetch cart from backend
                    const response = await axios.get('http://localhost:5004/cart/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // If backend returns { items: [...] }
                    const backendItems = response.data?.items || [];

                    setCartItems(backendItems);
                } else {
                    // Not logged in - use localStorage
                    setCartItems(localCart);
                }
            } catch (err) {
                setError('Failed to fetch cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [token]);

    const handleAddToCart = (product) => {
        if (token) {
            axios.post('http://localhost:5004/cart/add', { productId: product._id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    setCartItems(prevItems => [...prevItems, product]);
                })
                .catch(() => {
                    console.log('Failed to add item to cart');
                });
        } else {
            const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            storedCartItems.push(product);
            localStorage.setItem('cart', JSON.stringify(storedCartItems));
            setCartItems(storedCartItems);
        }
    };

    const handleRemoveItem = (productId) => {
        if (token) {
            axios.delete(`http://localhost:5004/cart/remove/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    setCartItems(cartItems.filter(item => item._id !== productId));
                })
                .catch(() => {
                    setError('Failed to remove item from cart');
                });
        } else {
            const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCartItems = storedCartItems.filter(item => item._id !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
        }
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-container">

            <div className="cart-main">
                {loading ? (
                    <p>Loading cart...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div>
                        <h2>Your Cart</h2>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty!</p>
                        ) : (
                            cartItems.map(item => (
                                <div key={item._id} className="cart-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <p>${item.price}</p>
                                        <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                                    </div>
                                </div>
                            ))
                        )}
                        {cartItems.length > 0 && (
                            <div className="cart-total">
                                <h3>Total: ${cartItems.reduce((acc, item) => acc + item.price, 0)}</h3>
                                <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Cart;
