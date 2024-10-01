import React, { useRef } from 'react';
import './Forgot.css';

const Verification = () => {
  // Create refs for the 6 inputs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Handle input change and auto-focus to the next field
  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (/\D/.test(value)) {
      e.target.value = ''; // If not a number, clear the input
      return;
    }

    // If there's input and it's valid, move to the next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace to move to the previous input
  const handleKeyUp = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div>
      <div className="ver-con">
        <div className="ver-box">
          <div className="ver-form">
            <h1>Forgot Password</h1>
            <p></p> {/* if there's any */}
            <div className="text-con">
              <p>We've sent a verification code to your email</p>
            </div>
            <form>
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="text"
                  maxLength={1}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyUp={(e) => handleKeyUp(e, index)}
                />
              ))}
              <button>Continue</button> {/* redirect to '/change-password' if code is a match */}
            
            </form>
            <div>
              <a href="/forgot-password">Resend Code</a>
              {/* Go back to ask for the email and sends new code */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
