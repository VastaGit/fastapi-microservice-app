import React, { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from "./OrdersNavbar";

const Orders: React.FC = () => {
    const [orders, setOrders] = useState([{
        "id": "",
        "product_id": "",
        "quantity": 0,
        "total": 0,
        "status": ""
    }]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8001/orders/")
            .then((response) => {
                console.log(response.data);
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <main className="main-content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h2>Orders</h2>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                                <th className="border border-gray-300 px-4 py-2">Product ID</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Total Price</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{order.product_id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{order.quantity}</td>
                                    <td className="border border-gray-300 px-4 py-2">{order.total}</td>
                                    <td className="border border-gray-300 px-4 py-2">{order.status}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Orders;
