import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgot.css';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    //check if both passwords match
    if (password === confirmPassword) {
      console.log('Password successfully changed!');
      navigate('/login'); // Redirect to login page after success
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <div className="cp-con">
      <div className="cp-box">
        <div className="cp-form">
          <h1>Change Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="input-container">
              <label>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button type="submit">Submit</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
