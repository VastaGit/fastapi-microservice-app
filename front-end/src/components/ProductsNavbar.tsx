import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary ">
        <Link className="navbar-brand text-white" to="/">Product App</Link>
        <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link text-white" to="/products">Products</Link>
                </li>
                {/* <li className="nav-item">
                    <Link className="nav-link" to="/orders">Orders</Link>
                </li> */}
            </ul>
        </div>
    </nav>
);

export default Navbar;
