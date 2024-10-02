import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Signup.css';
import login_image from '../../../assets/img/login_image.png'

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!firstName || !lastName || !email || !address || !phoneNumber || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/users-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, address, phoneNumber, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Signup failed');
      } else {
        setSuccess(result.message);
        setFirstName('');
        setLastName('');
        setEmail('');
        setAddress('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to login page after successful signup
        navigate('/login');
      }
    } catch (error) {
      setError('Error during signup');
      console.error('Error during signup:', error);
    }
  };

  return (
    <div class="d-flex justify-content-center">
      <section class="signup-con">
        <div class="container">
          <div class="row">
            <div class="col-12 col-xxl-11 d-flex justify-content-center">
              <div class="signup-box card border-light-subtle shadow-sm">
                
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
                              
                              <h2 class=" text-center">Registration</h2>
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
                              Register with Google
                            </button>
                            </div>
                            <div class="row d-flex justify-content-center align-items-center">
                            <div class="col"><hr></hr></div>
                            <div class="col-6"><p class="text-center mt-2 mb-2 text-secondary">Or Register with N&B</p></div>
                            <div class="col"><hr></hr></div>
                            </div>
                            
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} class="d-flex justify-content-center">
                          <div class="row gy-3 overflow-hidden d-flex justify-content-center">

                            <div class="row gy-3 d-flex justify-content-between m-0 p-0">

                              <div class="col">
                                <div class="form-floating">
                                  <input type="text" class="form-control" name="firstName" id="firstName" placeholder="First Name" 
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)} required
                                  />
                                  <label for="firstName" class="form-label">First Name</label>
                                </div>
                              </div>
                              <div class="col">
                                <div class="form-floating">
                                  <input type="text" class="form-control" name="lastName" id="lastName" placeholder="First Name"  
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)} required
                                  />
                                  <label for="lastName" class="form-label">Last Name</label>
                                </div>
                              </div>
                            </div>
                            

                            <div class="col-12">
                              <div class="form-floating">
                                <input type="email" class="form-control" name="email" id="email" placeholder="name@example.com"  
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)} required
                                  />
                                <label for="email" class="form-label">Email</label>
                              </div>
                            </div>

                            <div class="row gy-3 d-flex justify-content-between m-0 p-0">
                              <div class="col">
                                <div class="form-floating">
                                  <input type="address" class="form-control" name="address" id="address" placeholder="Address"  
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)} required
                                  />
                                  <label for="address" class="form-label">Address</label>
                                </div>
                              </div>
                              <div class="col">
                                <div class="form-floating">
                                  <input type="phone-number" class="form-control" name="phone-number" id="phone-number" placeholder="Phone Number"  
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)} required
                                  />
                                  <label for="phone-number" class="form-label">Phone Number</label>
                                </div>
                              </div>
                            </div>

                            <div class="row gy-3 d-flex justify-content-between m-0 p-0">
                              <div class="col">
                                <div class="form-floating">
                                  <input type="password" class="form-control" name="password" id="password" placeholder="Password"  
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)} required
                                  />
                                  <label for="password" class="form-label">Password</label>
                                </div>
                              </div>
                              <div class="col">
                                <div class="form-floating">
                                  <input type="password" class="form-control" name="confirm-password" id="confirm-password" placeholder="Confirm Password"  
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)} required
                                  />
                                  <label for="confirm-password" class="form-label">Confirm Password</label>
                                </div>
                              </div>
                            </div>
                            
                            <div class="col-12 p-0">
                              <div class="form-check m-0 p-0 text-center">
                                {/* <input class="form-check-input" type="checkbox" value="" name="iAgree" id="iAgree" required/> */}
                                <label class="form-check-label text-secondary m-0 p-0 text-center" for="iAgree">
                                  By signing up, you agree to N&B’s <a href="#!" class="link-primary text-decoration-none">Terms of Service</a> & <a href="#!" class="link-primary text-decoration-none">Privacy Policy</a>  
                                </label>
                              </div>
                            </div>

                            <div class="col-12">
                              <div class="d-grid">
                                <button class="btn btn-dark btn-lg" type="submit">Sign Up</button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div class="row mb-4">
                          <div class="col-12">
                            <p class="mb-0 mt-4 text-secondary text-center">Already have an account? <a href="/login" class="link-primary text-decoration-none">Login</a></p>
                          </div>
                        </div>
                        {error && <p className='error'>{error}</p>}
                        {success && <p className='success'>{success}</p>}
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

export default Signup;
