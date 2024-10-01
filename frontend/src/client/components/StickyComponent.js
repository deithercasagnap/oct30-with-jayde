import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import './StickyComponent.css';

const StickyComponent = ({ onSubmit }) => {
  const [isClicked, setIsClicked] = useState(false);

  // State to store user preferences
  const [formData, setFormData] = useState({
    hairType: '',
    hairRebonded: '',
    hairTexture: '',
    hairVirgin: '',
    hairColor: '',
    query: '' // Added query field for searching products
  });

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);  // Call the onSubmit function passed from ProductList
    } else {
      console.error('onSubmit function is not provided');
    }
  };

  return (
    <>
      {/* Sticky Button */}
      <div className={`sticky-card ${isClicked ? 'clicked' : ''}`} onClick={handleClick}>
        <p>Find Your Perfect Haircare Match</p>
        <i className='bx bx-chevron-right' style={{ fontSize: '26pt' }}></i>
      </div>

      {/* Expanded Content */}
      <div className={`expanded-content ${isClicked ? 'show' : ''}`}>
        <Card>
          <Card.Body>
            <h5>Healthy Hair Starts Here!</h5>
            <div className='forms'>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <p>Hair Type:</p>
                <div className='input'>
                  <input
                    type='radio'
                    id='straight'
                    value='straight'
                    name='hairType'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='straight'>Straight</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='wavy'
                    value='wavy'
                    name='hairType'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='wavy'>Wavy</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='curly'
                    value='curly'
                    name='hairType'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='curly'>Curly</label>
                </div>

                {/* Rebonded Section */}
                <p>Rebonded:</p>
                <div className='input'>
                  <input
                    type='radio'
                    id='rebondedYes'
                    value='Rebonded'
                    name='hairRebonded'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='rebondedYes'>Yes</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='rebondedNo'
                    value='no'
                    name='hairRebonded'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='rebondedNo'>No</label>
                </div>

                <p>Texture:</p>
                <div className='input'>
                  <input
                    type='radio'
                    id='frizzy'
                    value='frizzy'
                    name='hairTexture'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='frizzy'>Frizzy</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='damaged'
                    value='damaged'
                    name='hairTexture'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='damaged'>Damaged</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='oily'
                    value='oily'
                    name='hairTexture'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='oily'>Oily</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='dry'
                    value='dry'
                    name='hairTexture'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='dry'>Dry</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='normal'
                    value='normal'
                    name='hairTexture'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='normal'>Normal</label>
                </div>

                <p>Virgin:</p>
                <div className='input'>
                  <input
                    type='radio'
                    id='virginYes'
                    value='yes'
                    name='hairVirgin'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='virginYes'>Yes</label>
                </div>
                <div className='input'>
                  <input
                    type='radio'
                    id='virginNo'
                    value='no'
                    name='hairVirgin'
                    onChange={handleInputChange}
                  />
                  <label htmlFor='virginNo'>No</label>
                </div>


                <button type='submit'>Find Products</button>
              </form>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default StickyComponent;
