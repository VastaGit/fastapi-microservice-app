import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import Navbar from "./ProductsNavbar";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity_available: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/products")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`http://127.0.0.1:8000/products/${id}/`)
        .then(() => {
          setProducts(products.filter(product => product.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <Link
            to="/create-product"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.quantity_available}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Products;
