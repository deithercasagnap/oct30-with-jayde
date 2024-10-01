import React from 'react'
import Navigation from '../../components/Navigation'
import UserSideNav from '../../components/UserSideNav'

const UserProfile = () => {
  return (
    <div className='order-con'>
      <Navigation />
      <div className='order-box'>
            <div className='user'>
            <UserSideNav />
            </div>
            <div className='purchase'>
            <div className='purchase-box'>
                    <div className='purchase-header'>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfile