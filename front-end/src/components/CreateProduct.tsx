import React, { useState } from 'react';
import axios from 'axios';
import './CreateProduct.css'; // Import a CSS file for styling
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
            <div className="create-product-container">
                <form onSubmit={handleSubmit} className="create-product-form">
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity Available</label>
                        <input
                            type="number"
                            id="quantity"
                            className="form-control"
                            value={quantityAvailable}
                            onChange={(e) => setQuantityAvailable(e.target.value ? Number(e.target.value) : '')}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Product</button>
                </form>
            </div>
        </>

    );
};

export default CreateProduct;
