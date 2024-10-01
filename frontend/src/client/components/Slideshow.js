import React from 'react'
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const fadeImages  = [
    {
      imgURL:
        "https://cdn11.bigcommerce.com/s-erqth8a135/images/stencil/1280x1280/s/banner__78148.original.jpg",
      imgAlt: "img-1"
    },
    {
      imgURL:
        "https://johnlewis.scene7.com/is/image/johnlewis/best-hair-products",
      imgAlt: "img-2"
    },
    {
      imgURL:
        "https://wwd.com/wp-content/uploads/2024/07/being-haircare-monday-founder-products.jpg",
      imgAlt: "img-3"
    },
]
const Slideshow = () => {
    return (
      <div className="slideshow-con">
        <Fade>
          {fadeImages.map((fadeImage, index) => (
            <div key={index}>
              <img style={{width: '100%', height: '80vh', objectFit: 'cover', borderRadius: '10px'}} src={fadeImage.imgURL} alt={fadeImage.imgAlt}/>
            </div>
          ))}
        </Fade>
      </div>
    )
  }

export default Slideshow