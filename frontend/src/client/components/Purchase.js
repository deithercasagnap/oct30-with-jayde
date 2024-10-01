import React from 'react'
import '../pages/Transactions/Transaction.css'


const Purchase = ({ order }) => {
  const orderTotal = order.order_total ? order.order_total.toFixed(2) : '0.00';
  const itemTotal = order.item_total ? order.item_total.toFixed(2) : '0.00';

  return (
    <div className="order-item">
      <h4>Order ID: {order.order_id}</h4>
      <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
      <p>Total Price: ${orderTotal}</p>
      <div>
        <h5>Product Details</h5>
        <p>Product Name: {order.product_name}</p>
        <p>Quantity: {order.quantity}</p>
        <p>Item Total: ${itemTotal}</p>
      </div>
    </div>
  );
};

export default Purchase;
