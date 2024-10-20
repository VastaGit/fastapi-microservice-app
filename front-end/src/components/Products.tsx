import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import Navbar from "./ProductsNavbar";

const Products: React.FC = () => {
  const [products, setProducts] = useState([{
    "id": "",
    "name": "",
    "price": 0,
    "quantity_available": 0
  }]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/products/")
      .then((response) => {
        console.log(response.data)
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
    <div>
      <Navbar />

      <main className="main-content">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h2>Products</h2>
        </div>

        <Link to="/create-product" className="btn btn-primary mb-3">
          Add
        </Link>

        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.quantity_available}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Products;
