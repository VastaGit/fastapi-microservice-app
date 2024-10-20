import React, { useState } from 'react';
import axios from 'axios';
import './MakeOrder.css'; // Import a CSS file for styling
import Navbar from './OrdersNavbar';

const MakeOrder: React.FC = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [productDetails, setProductDetails] = useState<any>(null);
  const [orderResponse, setOrderResponse] = useState<any>(null);

  const fetchProductDetails = () => {
    axios.get(`http://127.0.0.1:8000/products/${productId}`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const orderData = {
      product_id: productId,
      quantity: Number(quantity),
    };

    axios.post('http://127.0.0.1:8001/order/', orderData)
      .then(response => {
        console.log('Order created:', response.data);
        setOrderResponse(response.data);
        setProductId('');
        setQuantity('');
        setProductDetails(null);
      })
      .catch(error => {
        console.error('Error creating order:', error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="make-order-container">
        <div className="form-group">
          <label htmlFor="productId">Product ID</label>
          <input
            type="text"
            id="productId"
            className="form-control"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
          <button onClick={fetchProductDetails} className="btn btn-secondary mt-2">Fetch Product Details</button>
        </div>

        {productDetails && (
          <div className="product-details-card">
            <h4>Product Details</h4>
            <p><strong>Name:</strong> {productDetails.name}</p>
            <p><strong>Price:</strong> {productDetails.price}</p>
            <p><strong>Quantity Available:</strong> {productDetails.quantity_available}</p>
          </div>
        )}

        {productDetails && (
          <form onSubmit={handleSubmit} className="make-order-form">
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Make Order</button>
          </form>
        )}

        {orderResponse && (
          <div className="order-response-card">
            <h4>Order Response</h4>
            <p><strong>Order ID:</strong> {orderResponse.id}</p>
            <p><strong>Product ID:</strong> {orderResponse.product_id}</p>
            <p><strong>Quantity:</strong> {orderResponse.quantity}</p>
            <p><strong>Fee:</strong> {orderResponse.fee}</p>
            <p><strong>Total Price:</strong> {orderResponse.total}</p>
            <p><strong>Status:</strong> {orderResponse.status}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MakeOrder;
