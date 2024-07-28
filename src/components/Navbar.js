// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav style={{ backgroundColor: '#007bff', padding: '10px' }}>
        <Link to="/" style={{ color: 'white', margin: '0 10px' }}>Home</Link>
        <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Login</Link>
    </nav>
);

export default Navbar;
