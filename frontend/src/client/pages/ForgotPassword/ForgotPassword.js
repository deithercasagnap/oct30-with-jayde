import React from 'react'
import './Forgot.css'

const ForgotPassword = () => {
  return (
    <div className='fp-con'>
        <div className='fp-box'>
          
          <div className='fp-form'>
            <h1>Forgot Password</h1>
            <p></p>{/* error */}
            <div className='text-con'>
                <p>Enter your email address</p>
              </div>
            <form>
              <input type='email'/>
              <button>Continue</button> {/* if email exist in db, redirect to '/verify', it sends the code to the email, else the error will show */}
              
            </form>

          </div>
        </div>
    </div>
  )
}

export default ForgotPassword