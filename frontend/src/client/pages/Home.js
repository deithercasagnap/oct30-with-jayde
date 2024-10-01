import React from 'react'
import Navigation from '../components/Navigation';
import Slideshow from '../components/Slideshow';
import Products from '../components/Products';
import Footer from '../components/Footer';
// import StickyComponent from '../../components/StickyComponent';

const Home = () => {

  return (
    <div className='home-con'>
      <Navigation />
      {/* <StickyComponent /> */}
      <Slideshow />
      <Products />
      <Footer />
    </div>
  )
}

export default Home