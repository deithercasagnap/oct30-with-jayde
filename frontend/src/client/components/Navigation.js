import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cartEventEmitter } from './eventEmitter'; // Import the event emitter

const Navigation = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Fetch cart item count
    const fetchCartItemCount = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            //angela
            const response = await axios.get('http://localhost:5001/cart-item-count', {

            //kurt
            // const response = await axios.get('http://localhost:5001/cart-item-count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setCartItemCount(response.data.itemCount);
            }
        } catch (error) {
            console.error('Error fetching cart item count:', error.response ? error.response.data : error.message);
        }
    };

    // Validate token and user session
    const validateToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        try {
            //angela
            const response = await axios.get('http://localhost:5001/validate-token', {

            //kurt
            // const response = await axios.get('http://localhost:5001/validate-token', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUsername(localStorage.getItem('username') || '');
                setFirstName(localStorage.getItem('first_name') || ''); // Retrieve first_name
                fetchCartItemCount(); // Fetch cart count on valid session
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error validating token:', error.response ? error.response.data : error.message);
            setIsLoggedIn(false);
        }
    };

    // Set up event listener for cart updates
    useEffect(() => {
        validateToken();

        // Subscribe to cart updates
        cartEventEmitter.on('cartUpdated', fetchCartItemCount);

        // Cleanup event listener on component unmount
        return () => {
            cartEventEmitter.off('cartUpdated', fetchCartItemCount);
        };
    }, []);


    // Handle user logout
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                //angela
                await axios.post('http://localhost:5001/logout', {}, {

                //kurt
                // await axios.post('http://localhost:5001/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                localStorage.removeItem('token');
            } catch (error) {
                console.error('Error logging out:', error.response ? error.response.data : error.message);
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('first_name'); // Remove first_name
        setUsername('');
        setFirstName('');
        setIsLoggedIn(false);
        navigate('/login');
    };


    // Navigate to cart or login if not logged in
    const handleCartClick = () => {
        if (isLoggedIn) {
            navigate('/cart');
        } else {
            navigate('/login');
        }
    };

    // Handle profile click to navigate to transaction page
    const handleProfileClick = () => {
        navigate('/user/purchase');
    };

    // Define navigation links
    const commonLinks = [
        { id: 1, page: "Shop", link: "/shop" },
        { id: 2, page: "About Us", link: "/about-us" },
        { id: 3, page: `Cart (${cartItemCount})`, link: "#" }
    ];

    return (
        <div className='nav-container'>
            <div className='logo'>
                <a href='/'>
                    <img src='https://us.123rf.com/450wm/dmrgraphic/dmrgraphic2105/dmrgraphic210500421/169019761-hair-woman-and-face-logo-and-symbols.jpg?ver=6' alt='Logo' />
                    <h1>N&B Beauty Vault</h1>
                </a>
            </div>

            <div className='searchbar'>
                <form>
                    <input type='search' placeholder='Search Product' />
                    <button type='submit'>
                        <i className='bx bx-search' style={{ color: '#ffffff' }}></i>
                    </button>
                </form>
            </div>

            <div className='navlinks'>
                <ul>
                    {commonLinks.map((data) => (
                        <li key={data.id}>
                            <a href={data.link} onClick={data.id === 3 ? handleCartClick : undefined}>{data.page}</a>
                        </li>
                    ))}
                    {!isLoggedIn ? (
                        <>
                            <li><a href='/signup'>Sign Up</a></li>
                            <li><a href='/login'>Login</a></li>
                        </>
                    ) : (
                        <>
                            <li><span onClick={handleProfileClick} style={{fontSize:'2rem'}}><i class='bx bxs-user-circle'></i></span></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navigation;
