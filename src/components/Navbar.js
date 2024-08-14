import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'; 

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <Link className="navbar-brand" to="/" style={{ marginLeft: '10px' }}>
            <img src={logo} alt="Logo" style={{ height: '60px' }} /> {/* Ajusta la altura según sea necesario */}
        </Link>
        <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/login" style={{ marginRight: '10px', color: '#2874a6' }}>Login</Link>
                </li>
            </ul>
        </div>
    </nav>
);

export default Navbar;
