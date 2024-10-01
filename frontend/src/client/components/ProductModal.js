import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './modal.css';

const ProductModal = ({ isOpen, product, onAddToCart, onClose }) => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);

    useEffect(() => {
        if (product) {
            setLoading(true);
            setError(null);

            fetch('http://localhost:5001/products-recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_code: product.product_code }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setRecommendedProducts(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching recommendations:', error);
                    setError('Failed to load recommendations.');
                    setLoading(false);
                });
        }
    }, [product]);

    const handleBuyNow = (product) => {
        const productData = {
            ...product,
            quantity: 1,
        };

        const existingProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

        existingProducts.push(productData);

        localStorage.setItem('selectedProducts', JSON.stringify(existingProducts));

        // Redirect to checkout
        window.location.href = '/checkout';
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentRecommendedProducts = recommendedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(recommendedProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (!isOpen || !product) return null;

    return (
        <div className="promodal-overlay" onClick={onClose}>
            <div className="promodal-content" onClick={(e) => e.stopPropagation()}>
                <div className="promodal-body"> 
                <button className="promodal-close" onClick={onClose}>✖</button>
                    <div className='selected-product'>

                    <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="modalproduct-image"
                    />
                    <hr/>

                    <h3 className="modalproduct-title">{product.product_name}</h3>

                    <p className="modalproduct-description">{product.description || 'No description available.'}</p>

                    <p className="modalproduct-price">Price: <span className="price-value">P{product.price}</span></p>
                    <p className="modalproduct-quantity">Available: {product.quantity}</p>

                    {product.quantity > 0 ? (
                        <div className="button-group">
                            <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
                            <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>Buy Now</button>
                        </div>
                    ) : (
                        <p className="out-of-stock">Out of stock</p>
                    )}


                    </div>
                    
                    <div className="recommendations">
                        <h4 className="recommendations-title">Recommended Products</h4>
                        {loading ? (
                            <p>Loading recommendations...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : currentRecommendedProducts.length > 0 ? (
                            <div className="recommended-modalproducts-grid">
                                {currentRecommendedProducts.map((recProduct) => (
                                    <div key={recProduct.product_id} className="modalproduct-card">
                                        <img
                                            src={recProduct.product_image}
                                            alt={recProduct.product_name}
                                            className="recommended-modalproduct-image"
                                        />
                                        <div className="modalproduct-details">
                                            <span className="modalproduct-name">{recProduct.product_name}</span>
                                            <span className="modalproduct-price">${recProduct.price}</span>
                                            {recProduct.product_status === 'Discounted' && (
                                                <span className="modalproduct-discount">
                                                    Discounted by: {recProduct.product_discount}%
                                                </span>
                                            )}
                                            {recProduct.quantity > 0 ? (
                                                <div className="recommended-button-group">
                                                    <button className="add-to-cart-btn" onClick={() => onAddToCart(recProduct)}>Add to Cart</button>
                                                    <button className="buy-now-btn" onClick={() => handleBuyNow(recProduct)}>Buy Now</button>
                                                </div>
                                            ) : (
                                                <p className="out-of-stock">Out of stock</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No recommendations available.</p>
                        )}

                        {totalPages > 1 && (
                            <div className="pagination">
                                {[...Array(totalPages).keys()].map(number => (
                                    <button
                                        key={number + 1}
                                        onClick={() => handlePageChange(number + 1)}
                                        className={`pagination-button ${number + 1 === currentPage ? 'active' : ''}`}
                                    >
                                        {number + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    product: PropTypes.shape({
        product_image: PropTypes.string.isRequired,
        product_code: PropTypes.string,
        product_name: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number
    }),
    onAddToCart: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProductModal;
