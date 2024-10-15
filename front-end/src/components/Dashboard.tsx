import React, { useEffect, useState } from "react";
import './Dashboard.css';
import axios from 'axios';

const Dashboard: React.FC = () => {
    const [products, setProducts] = useState([ {
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

    return (
        <div>
            <nav className="sidebar">
                <div className="sidebar-sticky pt-3">
                    <h4 className="sidebar-heading">My App</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a
                                className="nav-link btn btn-primary w-100"
                                href="/dashboard"
                            >
                                Dashboard
                            </a>
                        </li>
                        {/* Additional Navigation Links (Uncomment if needed) */}
                        {/* 
            <li className="nav-item mb-2">
              <a className="nav-link" href="/profile">
                Profile
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/settings">
                Settings
              </a>
            </li>
            */}
                    </ul>
                </div>
            </nav>
            <main className="main-content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h2>Dashboard</h2>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">ID</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.quantity_available}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
