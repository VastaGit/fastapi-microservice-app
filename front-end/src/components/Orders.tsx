import React, { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from "./OrdersNavbar";

interface Order {
    id: string;
    product_id: string;
    quantity: number;
    total: number;
    status: string;
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        axios
            .get("http://127.0.0.1/payment/orders",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            .then((response) => {
                console.log(response.data);
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Product ID</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Total Price</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4">{order.id}</td>
                                    <td className="px-6 py-4">{order.product_id}</td>
                                    <td className="px-6 py-4">{order.quantity}</td>
                                    <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                                    <td className={
                                        `px-6 py-4 rounded-md text-center ${order.status === "Completed"
                                            ? "bg-green-100 text-green-800"
                                            : order.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`
                                    }>
                                        {order.status}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No orders available.
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

export default Orders;
