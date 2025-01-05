import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './ProductsNavbar';

const CreateProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [quantityAvailable, setQuantityAvailable] = useState<number | ''>('');
    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const productData = {
            name,
            price: Number(price),
            quantity_available: Number(quantityAvailable),
        };

        axios.post('http://127.0.0.1:8000/products/', productData)
            .then(response => {
                console.log('Product created:', response.data);
                setName('');
                setPrice('');
                setQuantityAvailable('');
            })
            .catch(error => {
                console.error('Error creating product:', error);
            });

        await navigate(-1)
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Create New Product</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                id="price"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
                                Quantity Available
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={quantityAvailable}
                                onChange={(e) => setQuantityAvailable(e.target.value ? Number(e.target.value) : '')}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Create Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;
