import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import './orderhistory.css';
import UserSideNav from '../../components/UserSideNav';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // State to manage filter

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/order-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            status: statusFilter // Add status filter to request
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]); // Fetch orders when statusFilter changes

  const handleStatusClick = (status) => {
    setStatusFilter(status);
    setLoading(true); // Show loading state while fetching
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post('http://localhost:5001/cancel-order', {
        order_id: orderId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh orders after cancellation
      setOrders(orders.map(order =>
        order.order_id === orderId ? { ...order, order_status: 'Cancelled' } : order
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
              <h3>Order History</h3>
            </div>
            <div className='purchase-body'>
              <div className='purchase-btncon'>
                <button onClick={() => handleStatusClick('')}>All</button>
                <button onClick={() => handleStatusClick('To Ship')}>To Ship</button>
                <button onClick={() => handleStatusClick('To Receive')}>To Receive</button>
                <button onClick={() => handleStatusClick('Completed')}>Completed</button>
                <button onClick={() => handleStatusClick('Cancelled')}>Cancelled</button>
                <button onClick={() => handleStatusClick('Return/Refund')}>Return/Refund</button>
              </div>
              <div className='order'>
                {orders.length === 0 ? (
                  <p>No orders found</p>
                ) : (
                  orders.map(order => (
                    <div key={order.order_id} className="order-item">
                      <h4>Order ID: {order.order_id}</h4>
                      <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                      <p>Total Price: P{order.order_total ? order.order_total.toFixed(2) : '0.00'}</p>
                      <p>Order Status: {order.order_status}</p> {/* Display order status */}
                      <div>
                        <h5>Product Details</h5>
                        {order.products.map((product, index) => (
                          <div key={index} className="product-details">
                            <p>Product Name: {product.product_name}</p>
                            <p>Price: P{product.price ? product.price.toFixed(2) : '0.00'}</p>
                            <p>Quantity: {product.quantity}</p>
                            <p>Item Total: P{product.item_total ? product.item_total.toFixed(2) : '0.00'}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCancelOrder(order.order_id)}
                        className={`cancel-button ${order.order_status === 'Pending' ? '' : 'disabled'}`}
                        disabled={order.order_status !== 'Pending'}
                      >
                        Cancel Order
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
