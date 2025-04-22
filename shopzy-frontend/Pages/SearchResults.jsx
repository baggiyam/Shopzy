// src/Pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery().get("q");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/search?q=${encodeURIComponent(query)}`);
                setResults(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Search failed");
            } finally {
                setLoading(false);
            }
        };

        if (query) fetchResults();
    }, [query]);

    return (
        <>

            <div className="main-content">
                <h2>Search Results for: "{query}"</h2>

                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && results.length === 0 && <p>No results found.</p>}

                <div className="product-row">
                    {results.map(product => (
                        <div key={product._id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <h4>{product.name}</h4>
                            <p>${product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default SearchResults;
