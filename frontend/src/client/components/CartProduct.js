import React, { useState, useEffect } from 'react';

const CartProduct = ({
  productName,
  cartItemId, // Correct ID for cart_items_id
  quantity, // Initial quantity from props
  price,
  productCode,
  isSelected,
  toggleItemSelection,
  updateQuantity // Function to handle quantity updates
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  // Sync localQuantity with the props.quantity if it changes
  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]); // Dependency on quantity to update localQuantity

  // Function to handle quantity change from input or buttons
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10); // Ensure it's an integer
    if (newQuantity >= 1) {
      setLocalQuantity(newQuantity); // Update local quantity
      updateQuantity(cartItemId, newQuantity); // Send updated quantity to parent or backend
    }
  };

  // Function to increase quantity
  const incrementQuantity = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    updateQuantity(cartItemId, newQuantity);
  };

  // Function to decrease quantity (ensure it's at least 1)
  const decrementQuantity = () => {
    const newQuantity = localQuantity > 1 ? localQuantity - 1 : 1;
    setLocalQuantity(newQuantity);
    updateQuantity(cartItemId, newQuantity);
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleItemSelection(productCode)}
        />
      </td>
      <td>{cartItemId}</td>
      <td>{productName}</td>
      <td>
        <button onClick={decrementQuantity}>-</button> {/* Decrement button */}
        <input
          type="number"
          value={localQuantity}
          min="1"
          onChange={handleQuantityChange} // Input change for manual input
          style={{ width: "50px", textAlign: "center" }}
        />
        <button onClick={incrementQuantity}>+</button> {/* Increment button */}
      </td>
      <td>P{price.toFixed(2)}</td>
      <td>P{(price * localQuantity).toFixed(2)}</td>
    </tr>
  );
};

export default CartProduct;
