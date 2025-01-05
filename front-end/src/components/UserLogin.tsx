// src/components/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Define the structure of the JWT token payload
interface TokenPayload {
    user_id: string;
    email: string;
    role: 'buyer' | 'seller';
    exp: number;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const loginData = {
            email,
            password,
        };
        try {
            // Make a POST request to the login endpoint
            const response = await axios.post('http://127.0.0.1/auth/login', loginData);

            console.log('Login successful:', response.data);

            // Extract the token from the response
            const token: string = response.data.token;

            if (!token) {
                throw new Error('Token not provided');
            }

            // Save the token in sessionStorage instead of localStorage
            sessionStorage.setItem('token', token);

            // Decode the token to extract the role
            const decoded: TokenPayload = jwtDecode(token);
            console.log(decoded);

            // Extract the role from the decoded token
            const userRole = decoded.role;

            if (!userRole) {
                throw new Error('User role not found in token');
            }

            // Redirect based on the user's role
            if (userRole === 'buyer') {
                navigate('/orders');
            } else if (userRole === 'seller') {
                navigate('/products');
            } else {
                // Handle unexpected roles or provide a default route
                navigate('/');
            }
        } catch (err: any) {
            console.error('Error during login:', err);
            // Handle different error types (optional)
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                    {error && (
                        <div className="p-2 text-red-700 bg-red-100 border border-red-400 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-600">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:underline">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
