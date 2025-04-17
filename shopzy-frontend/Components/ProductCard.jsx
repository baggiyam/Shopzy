import React from 'react';


const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                    ${product.price} <span className="discount-price">{product.discountPrice && `$${product.discountPrice}`}</span>
                </div>
                <div className="product-rating">
                    {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} className={index < product.rating ? 'filled-star' : 'empty-star'}>
                            ★
                        </span>
                    ))}
                </div>
                <button className="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;
