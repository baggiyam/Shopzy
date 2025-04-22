import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../Styles/home.css';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [trending, setTrending] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const [featuredRes, trendingRes, newRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/featured`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/trending`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/new`),
                ]);

                setFeatured(featuredRes.data);
                setTrending(trendingRes.data);
                setNewArrivals(newRes.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Function to add product to cart (localStorage or backend depending on login state)
    const addToCart = (product) => {
        const token = localStorage.getItem('token');
        if (token) {
            // If the user is logged in, add to the backend cart
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/add`, { productId: product._id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    alert(`${product.name} added to Cart!`);
                })
                .catch(() => {
                    alert('Failed to add item to Cart');
                });
        } else {
            // If the user is not logged in, store the item in localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ ...product, quantity: 1 });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.name} added to Cart!`);
        }
    };

    // Function to add product to wishlist (localStorage or backend depending on login state)
    const addToWishlist = (product) => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/wishlist/add`, { productId: product._id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => alert(`${product.name} added to Wishlist!`))
                .catch(() => alert('Failed to add item to Wishlist'));
        } else {
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            if (!wishlist.some(item => item._id === product._id)) {
                wishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                console.log('Wishlist updated in localStorage:', wishlist);
                alert(`${product.name} added to Wishlist!`);
            }
        }
    };

    // Function to render a product row with a title
    const renderRow = (title, products) => (
        <div className="section">
            <h2>{title}</h2>
            <div className="product-row">
                {products.length === 0 ? (
                    <p>No products available</p>
                ) : (
                    products.map((product) => (
                        <div className="product-card" key={product._id}>
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p>${product.price}</p>
                            </div>
                            <div className="product-actions">
                                <button onClick={() => addToCart(product)}>Add to Cart</button>
                                <button onClick={() => addToWishlist(product)}>❤️ Wishlist</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="home-container">

            <div className="main-content">
                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : (
                    <>
                        {renderRow('Featured Products', featured)}
                        {renderRow('Trending Now', trending)}
                        {renderRow('New Arrivals', newArrivals)}
                    </>
                )}
            </div>

        </div>
    );
};

export default Home;
