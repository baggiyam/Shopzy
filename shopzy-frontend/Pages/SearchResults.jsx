import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery().get('q'); // Get the 'q' parameter from the URL

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true); // Start loading
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/product/search?q=${encodeURIComponent(query)}`
                );
                setResults(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Search failed');
            } finally {
                setLoading(false); // End loading
            }
        };

        if (query) {
            fetchResults();
        } else {
            setError('No search query provided');
        }
    }, [query]);

    // Function to add a product to cart
    const addToCart = (product) => {
        const token = localStorage.getItem('token');
        if (token) {
            // If the user is logged in, add to the backend cart
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
                    { productId: product._id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
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

    // Function to add a product to wishlist
    const addToWishlist = (product) => {
        const token = localStorage.getItem('token');

        if (token) {
            // User is logged in, add product to the wishlist backend
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/wishlist/add`,
                    { productId: product._id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => alert(`${product.name} added to Wishlist!`))
                .catch(() => alert('Failed to add item to Wishlist'));
        } else {
            // If user is not logged in, store in localStorage
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // Check if the item is already in the wishlist
            if (!wishlist.some((item) => item._id === product._id)) {
                wishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                alert(`${product.name} added to Wishlist!`);
            }
        }
    };

    return (
        <div className="main-content">
            <h2>Search Results for: "{query}"</h2>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && results.length === 0 && <p>No results found.</p>}

            <div className="product-row">
                {results.map((product) => (
                    <div key={product._id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                        <div className="product-actions">
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                            <button onClick={() => addToWishlist(product)}>❤️ Wishlist</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
