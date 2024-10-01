import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './client/pages/Home';
import Login from './client/pages/Login/Login';
import Signup from './client/pages/Signup/Signup';
import Cart from './client/pages/Cart/Cart';
import Checkout from './client/pages/Transactions/Checkout'
import OrderHistory from './client/pages/Transactions/OrderHistory';

import Shop from './client/pages/Cart/shop';


import ForgotPassword from './client/pages/ForgotPassword/ForgotPassword'
import Verification from './client/pages/ForgotPassword/Verification'
import ChangePassword from './client/pages/ForgotPassword/ChangePassword'
import UserProfile from './client/pages/Transactions/UserProfile';
import Notification from './client/pages/Transactions/Notification';
import DiscountsandVouchers from './client/pages/Transactions/DiscountsandVouchers';


function App() {
  const [loginStatus, setLoginStatus] = useState('');  // Store login status
  const [error, setError] = useState('');  // Store error message (if any)

  
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect any undefined route to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/user/purchase" element={<OrderHistory />} />
        <Route path='/shop' element={<Shop />}></Route>

        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/user/purchase" element={<OrderHistory/>}/>
        <Route path="/user" element={<UserProfile/>}/>
        <Route path="/user/notifications" element={<Notification/>}/>
        <Route path="/user/discounts+vouchers" element={<DiscountsandVouchers/>}/>
        
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/verify' element={<Verification/>}></Route>
        <Route path='/change-password' element={<ChangePassword/>}></Route>
        


      </Routes>
    </BrowserRouter>



  );
}

export default App;
