import React, { useState } from 'react';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Form submission started');

        try {
            console.log('Sending login request with:', { email, password });

            // Make the login request
            //angela
            const response = await axios.post('http://localhost:5001/customer-login', { email, password });

            //kurt
            // const response = await axios.post('http://localhost:5001/customer-login', { email, password });

            console.log('Login response:', response);

            if (response.status === 200) {
                // If login is successful, store token, user_id, username, and first_name
                setLoginStatus('Login successful');
                localStorage.setItem('token', response.data.token); // Store token
                localStorage.setItem('customer_id', response.data.user_id); // Store user_id
                localStorage.setItem('username', response.data.username); // Store username

                // Store first_name and log it
                localStorage.setItem('first_name', response.data.first_name); // Store first_name

                console.log('Stored first_name:', response.data.first_name); // Log the stored first_name
                console.log('Stored ID:', response.data.user_id); // Log the stored first_name

                // Redirect to homepage
                navigate('/');
            }
        } catch (err) {
            // Handle errors
            console.error('Error during login:', err);

            if (err.response) {
                setError(err.response.data.message || 'An error occurred during login');
            } else if (err.request) {
                setError('No response received from the server');
            } else {
                setError('Error setting up the request: ' + err.message);
            }
        } finally {
            setLoading(false);
            console.log('Form submission ended, loading state:', loading);
        }
    };

    return (
        <div className='login-con'>
            <div className='login-box'>
                
                <div className='login-form'>
                    <h1>Log In</h1>
                    {error && <p className='error'>{error}</p>}
                    <div className='login-google'>
                        <form>
                            <div>
                                <button>Continue with Google</button>
                                <div><p>Or Login with N&B</p></div>
                            </div>
                        </form>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='input'>
                            <label>Email</label> {/* Changed from Username to Email */}
                            <input
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input'>
                            <label>Password</label>
                            <input
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <a href='/forgot-password'>Forgot Password?</a>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    
                    {loginStatus && <p className='status'>{loginStatus}</p>}
                    <p>Don't have an account? <a href='/signup'>Sign Up</a></p>
                </div>
                <div className='login-image'>
                    <img src='https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1723441265778-917980.jpeg' alt='highlight photo' />
                </div>
                
            </div>
        </div>
    );
};

export default Login;
