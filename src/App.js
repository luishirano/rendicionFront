// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ContadorModule from './components/ContadorModule';
import ColaboradorModule from './components/ColaboradorModule';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import './index.css';
import api from './api';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/contador" element={<ContadorModule user={user} />} />
                <Route path="/colaborador/*" element={<ColaboradorModule user={user} />} />
                <Route path="/admin" element={<AdminDashboard user={user} />} />
                <Route path="/" element={<Home user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;
