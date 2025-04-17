import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
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
                    axios.get('http://localhost:5004/product/featured'),
                    axios.get('http://localhost:5004/product/trending'),
                    axios.get('http://localhost:5004/product/new'),
                ]);


                console.log('Featured Products:', featuredRes.data);
                console.log('Trending Products:', trendingRes.data);
                console.log('New Arrivals:', newRes.data);

                setFeatured(featuredRes.data);
                setTrending(trendingRes.data);
                setNewArrivals(newRes.data);
                setLoading(false); // Stop loading
            } catch (error) {
                setLoading(false);
                setError('Error fetching products');
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const renderProducts = (products) => (
        <div className="product-grid">
            {products.length === 0 ? (
                <p>No products available</p>
            ) : (
                products.map((product) => (
                    <div className="product-card" key={product._id}>
                        <img src={product.image} alt={product.name} />
                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="home-container">
            <Header />
            <div className="main-content">
                {error && <div className="error-message">{error}</div>}

              
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <h2>Featured Products</h2>
                        {renderProducts(featured)}

                        <h2>Trending Now</h2>
                        {renderProducts(trending)}

                        <h2>New Arrivals</h2>
                        {renderProducts(newArrivals)}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
