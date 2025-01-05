import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './OrdersNavbar';

const MakeOrder: React.FC = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [productDetails, setProductDetails] = useState<any>(null);
  const [orderResponse, setOrderResponse] = useState<any>(null);

  const fetchProductDetails = () => {
    axios
      .get(`http://127.0.0.1/inventory/products/${productId}`)
      .then((response) => {
        setProductDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const orderData = {
      product_id: productId,
      quantity: Number(quantity),
    };

    const token = sessionStorage.getItem('token');
    axios
      .post('http://127.0.0.1/payment/order', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log('Order created:', response.data);
        setOrderResponse(response.data);
        setProductId('');
        setQuantity('');
        setProductDetails(null);
      })
      .catch((error) => {
        console.error('Error creating order:', error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div className="space-y-4">
            <label htmlFor="productId" className="block text-gray-700 font-medium">
              Product ID
            </label>
            <input
              type="text"
              id="productId"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
            <button
              onClick={fetchProductDetails}
              className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Fetch Product Details
            </button>
          </div>

          {productDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-xl font-semibold mb-2">Product Details</h4>
              <p>
                <strong>Name:</strong> {productDetails.name}
              </p>
              <p>
                <strong>Price:</strong> {productDetails.price}
              </p>
              <p>
                <strong>Quantity Available:</strong> {productDetails.quantity_available}
              </p>
            </div>
          )}

          {productDetails && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-gray-700 font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Make Order
              </button>
            </form>
          )}

          {orderResponse && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-xl font-semibold mb-2">Order Response</h4>
              <p>
                <strong>Order ID:</strong> {orderResponse.id}
              </p>
              <p>
                <strong>Product ID:</strong> {orderResponse.product_id}
              </p>
              <p>
                <strong>Quantity:</strong> {orderResponse.quantity}
              </p>
              <p>
                <strong>Fee:</strong> {orderResponse.fee}
              </p>
              <p>
                <strong>Total Price:</strong> {orderResponse.total}
              </p>
              <p>
                <strong>Status:</strong> {orderResponse.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MakeOrder;
