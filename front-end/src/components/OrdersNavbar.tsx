import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('token');
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600">
            <div className="container flex items-center justify-between px-4 py-3 mx-auto">
                <Link to="/orders" className="text-lg font-semibold text-white">
                    Azazon
                </Link>
                <div>
                    {isLoggedIn && (
                        <>
                            <Link to="/orders" className="px-3 py-2 text-white rounded hover:bg-blue-700">
                                Orders
                            </Link>
                            <Link to="/make-order" className="px-3 py-2 text-white rounded hover:bg-blue-700">
                                Make Order
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 ml-2 text-white bg-red-600 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
