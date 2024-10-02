import React, { useState } from 'react';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import login_image from '../../../assets/img/login_image.png'

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
            const response = await axios.post('http://localhost:5001/customer-login', { email, password });

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

        <div class="d-flex justify-content-center">
            <section class="login-con">
                <div class="container">
                    <div class="row">
                        <div class="col-12 col-xxl-11 d-flex justify-content-center">
                            <div class="login-box card border-light-subtle shadow-sm">
                            
                            <div class="row g-0">

                                <div class="col-12 col-md-6">
                                <img class="img-fluid rounded-start w-100 h-100 object-fit-cover" loading="lazy" src={login_image} alt="login-image"/>
                                </div>

                                <div class="col-gradient col-12 col-md-6 d-flex justify-content-center">
                                <div class="col-12 col-lg-11 col-xl-10">
                                    <div class="card-body p-0">
                                    <div class="row">
                                        <div class="col-12 mt-4">
                                        <div class="mb-4">
                                            
                                            <h2 class=" text-center">Login</h2> 
                                            
                                        </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                        <div class="d-flex gap-3 flex-column">
                                        <button class="d-flex btn btn-outline-danger justify-content-center align-items-center">
                                            <img style={{ height: '30px', width: '30px'}}
                                            src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png"
                                            alt="Google Icon"
                                            class="me-2"
                                            />
                                            Login with Google
                                        </button>
                                        </div>
                                        <div class="row d-flex justify-content-center align-items-center">
                                        <div class="col"><hr></hr></div>
                                        <div class="col-6"><p class="text-center mt-2 mb-2 text-secondary">Or Login with N&B</p></div>
                                        <div class="col"><hr></hr></div>
                                        </div>
                                        
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} class="d-flex justify-content-center">
                                        <div class="row gy-3 overflow-hidden d-flex justify-content-center">

                                        <div class="col-12">
                                            <div class="form-floating">
                                            <input type="email" class="form-control" name="email" id="email" placeholder="name@example.com"  
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)} required
                                                />
                                            <label for="email" class="form-label">Email</label>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="form-floating">
                                            <input type="password" class="form-control" name="password" id="password" placeholder="name@example.com"  
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)} required
                                                />
                                            <label for="password" class="form-label">Password</label>
                                            </div>
                                        </div>

                                        
                                        <div class="col-12">
                                            <div class="form-check d-flex justify-content-end">
                                            {/* <input class="form-check-input" type="checkbox" value="" name="iAgree" id="iAgree" required/> */}
                                            <a href='/forgot-password'>Forgot Password?</a>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-grid">
                                                <button class="btn bsb-btn-xl btn-dark fs-5" type='submit' disabled={loading}>
                                                    {loading ? 'Logging in...' : 'Login'}
                                                </button>
                                                {error && <p class='error text-danger text-center mt-2'>{error}</p>}
                                            
                                            </div>
                                        </div>
                                        </div>
                                    </form>

                                    
                                    {loginStatus && <p className='status'>{loginStatus}</p>}
                                    <div class="row mb-4">
                                        <div class="col-12">
                                        <p class="mb-0 mt-4 text-secondary text-center">Not Registered Yet? <a href="/signup" class="link-primary text-decoration-none">Register</a></p>
                                        </div>
                                    </div>
                                    
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </section>

        </div>


    );
};

export default Login;
