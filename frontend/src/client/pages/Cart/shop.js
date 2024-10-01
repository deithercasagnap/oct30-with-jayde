import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Shop.css';
import Navigation from '../../components/Navigation';
import { cartEventEmitter } from '../../components/eventEmitter';
import ProductModal from '../../components/ProductModal';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [topPickedProducts, setTopPickedProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {

                const response = await axios.get('http://localhost:5001/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
                setCategories([...new Set(response.data.map(product => product.category_name))]);
            } catch (error) {
                setError('Error fetching products: ' + (error.response ? error.response.data : error.message));
            } finally {
                setLoading(false);
            }
        };

        const fetchTopPickedProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5001/products-top-picks');
                setTopPickedProducts(response.data);
            } catch (error) {
                console.error('Error fetching top-picked products:', error.response ? error.response.data : error.message);
            }
        };


        const fetchRecommendedProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/products-bundle-recommendation`);
                if (response.data.length === 0) {
                    console.log('No recommended products found.');
                }
                setRecommendedProducts(response.data);
            } catch (error) {
                console.error('Error fetching recommended products:', error.response ? error.response.data : error.message);
            }
        };



        fetchProducts();
        fetchTopPickedProducts();
        fetchRecommendedProducts();
    }, []);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        const filtered = category ? products.filter(product => product.category_name === category) : products;
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleBuyNow = (product) => {
        const productData = {
            ...product,
            quantity: product.quantity = 1,
        };

        const existingProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

        existingProducts.push(productData);


        localStorage.setItem('selectedProducts', JSON.stringify(existingProducts));

        // Redirect to the checkout page
        window.location.href = '/checkout';
        console.log(productData);
    };

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('customer_id');

        if (!token || !userId) {
            console.log('User not logged in or user ID missing');
            return;
        }

        try {
            await axios.post(
                'http://localhost:5001/add-to-cart',
                { product_code: product.product_code, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Product added to cart');
            cartEventEmitter.emit('cartUpdated', { product_code: product.product_code, quantity: 1 });
        } catch (error) {
            console.error('Error adding product to cart:', error.response ? error.response.data : error.message);
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='shop-container'>
            <Navigation />
            {/* Top Picks Section */}
            <div className='top-picks-section'>
                <h2>Top Picks</h2>
                <div className='shopproduct-list'>
                    {topPickedProducts.map((product) => (
                        <div key={product.product_code} className='shopproduct-item' onClick={() => openModal(product)}>
                            <div className='shopproduct-img'>
                                <img
                                    src={product.product_image || 'https://via.placeholder.com/150'}
                                    alt={product.product_name || 'Product Image'}
                                />
                            </div>
                            <div className='shopproduct-desc'>
                                <p className='shopproduct-name'>{product.product_name || 'No product name'}</p>
                                <p className='shopproduct-quantity'>Quantity: {product.quantity}</p>
                                <p className='shopproduct-price'>Price: ${product.price}</p>
                                {product.product_status === 'Discounted' && (
                                    <p className='shopproduct-price'>Product Discount: P{product.product_discount}%</p>
                                )}
                                {product.quantity > 0 ? (
                                    <>
                                        <button
                                            className='add-to-cart-button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className='buy-now-button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBuyNow(product, product.quantity);
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                ) : (
                                    <p className='out-of-stock'>Out of Stock</p>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bundle Section */}
            {recommendedProducts.length > 0 && (
                <div className='recommendations-section'>
                    <h2>Discounted Products</h2>
                    <div className='shopproduct-list'>
                        {recommendedProducts.map((product) => (
                            <div key={product.product_code} className='shopproduct-item' onClick={() => openModal(product)}>
                                <div className='shopproduct-img'>
                                    <img
                                        src={product.product_image || 'https://via.placeholder.com/150'}
                                        alt={product.product_name || 'Product Image'}
                                        loading="lazy"
                                    />
                                </div>
                                <div className='shopproduct-desc'>
                                    <p className='shopproduct-name'>{product.product_name || 'No product name available'}</p>
                                    <p className='shopproduct-quantity'>Quantity: {product.quantity !== undefined ? product.quantity : 'N/A'}</p>
                                    <p className='shopproduct-price'>Price: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</p>

                                    {product.product_status === 'Discounted' && (
                                        <p className='shopproduct-discount'>Discount: {product.product_discount}%</p>
                                    )}

                                    {product.quantity > 0 ? (
                                        <div className='button-group'>
                                            <button
                                                className='add-to-cart-button'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(product);
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className='buy-now-button'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBuyNow(product, product.quantity);
                                                }}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    ) : (
                                        <p className='out-of-stock'>Out of Stock</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Section */}
            <div className='filter-section'>
                <label htmlFor='category-filter'>Filter by Category:</label>
                <select id='category-filter' value={selectedCategory} onChange={handleCategoryChange}>
                    <option value=''>All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Products List */}
            <div className='shopproduct-list'>
                {currentProducts.map((product) => (
                    <div key={product.product_code} className='shopproduct-item' onClick={() => openModal(product)}>
                        <div className='shopproduct-img'>
                            <img
                                src={product.product_image || 'https://via.placeholder.com/150'}
                                alt={product.product_name || 'Product Image'}
                            />
                        </div>
                        <div className='shopproduct-desc'>
                            <p className='shopproduct-name'>{product.product_name || 'No product name'}</p>
                            <p className='shopproduct-quantity'>Quantity: {product.quantity}</p>
                            <p className='shopproduct-price'>Price: P{product.price}</p>
                            {product.product_status === 'Discounted' && (
                                <p className='shopproduct-price'>Product Discount: P{product.product_discount}%</p>
                            )}
                            {/* <p className='shopproduct-brand'>Brand: {product.brand}</p> */}

                            {product.quantity > 0 ? (
                                <>
                                    <button
                                        className='add-to-cart-button'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        className='buy-now-button'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBuyNow(product, product.quantity);
                                        }}
                                    >
                                        Buy Now
                                    </button>
                                </>
                            ) : (
                                <p style={{ color: 'red' }}>Out of stock</p>
                            )}

                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className='shoppagination'>
                {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={number + 1 === currentPage ? 'active' : ''}>
                        {number + 1}
                    </button>
                ))}
            </div>

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    product={selectedProduct}
                    onAddToCart={handleAddToCart}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Shop;
