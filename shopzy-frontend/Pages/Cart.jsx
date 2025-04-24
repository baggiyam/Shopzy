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
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/add`, { productId: item._id, quantity: item.quantity }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
                localStorage.removeItem('cart');
            } catch (err) {
                console.error('Error syncing local cart to backend:', err);
            }
        };

        const fetchCartItems = async () => {
            try {
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];

                if (token) {
                    if (localCart.length > 0) {
                        await syncLocalCartToBackend(localCart);
                    }

                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const backendItems = response.data?.items || [];
                    setCartItems(backendItems);
                } else {
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
        if (!product || !product._id) {
            console.error('Invalid product:', product);
            return;
        }

        const quantity = 1; // Default quantity is 1
        const cartItemIndex = cartItems.findIndex(item => item._id === product._id); // Check if the product already exists in the cart

        if (cartItemIndex > -1) {
            // If the product exists in the cart, update the quantity
            const updatedCartItems = [...cartItems];
            updatedCartItems[cartItemIndex].quantity += quantity; // Increase the quantity
            setCartItems(updatedCartItems); // Update the cart state

            if (token) {
                // Update the quantity in the backend if logged in
                axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
                    { productId: product._id, quantity: updatedCartItems[cartItemIndex].quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                    .then(() => {
                        console.log('Cart quantity updated in backend');
                    })
                    .catch(() => {
                        console.error('Failed to update cart quantity on backend');
                    });
            } else {
                // For guest users, update the cart in localStorage
                localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            }
        } else {
            // If the product is not in the cart, add it
            const newCartItem = { ...product, quantity };
            const updatedCartItems = [...cartItems, newCartItem];
            setCartItems(updatedCartItems); // Update the cart state

            if (token) {
                // Send the new item to the backend if logged in
                axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
                    { productId: product._id, quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                    .then(() => {
                        console.log('Product added to cart in backend');
                    })
                    .catch(() => {
                        console.log('Failed to add product to cart on backend');
                    });
            } else {
                // For guest users, update the cart in localStorage
                const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
                storedCartItems.push(newCartItem);
                localStorage.setItem('cart', JSON.stringify(storedCartItems));
            }
        }
    };

    const handleRemoveItem = (productId) => {
        if (token) {
            axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/remove/${productId}`, {
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

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Map over the cart items and update the specific product's quantity
        const updatedItems = cartItems.map(item => {
            if (item._id === productId) {
                // Calculate the updated price by multiplying original price with new quantity
                return { ...item, quantity: newQuantity }; // Update the item with new quantity
            }
            return item;
        });

        setCartItems(updatedItems); // Update the state with the new cart items

        if (token) {
            // Send request to backend to update the cart if logged in
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/update`,
                { productId, quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
                .then(() => {
                    console.log('Cart updated on backend');
                })
                .catch((err) => {
                    console.error('Failed to update quantity on backend:', err);
                });
        } else {
            // For guest users, update localStorage cart
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        }
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout');
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
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
                                        <p>{item.description}</p>

                                        <div className="quantity-control">
                                            <button onClick={() => handleQuantityChange(item._id, Math.max(item.quantity - 1, 1))}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                                        </div>

                                        <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                                    </div>
                                </div>
                            ))
                        )}
                        {cartItems.length > 0 && (
                            <div className="cart-total">
                                <h3>Total: ${calculateTotal()}</h3>
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
