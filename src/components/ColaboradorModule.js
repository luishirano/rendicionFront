// src/components/ColaboradorModule.js

import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import api from '../api';
import Home from './Home';
import RendicionGastos from './RendicionGastos';

const ColaboradorModule = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/rendicion-gastos" element={<RendicionGastos />} />
                <Route path="/historial" element={<div>Historial de Gastos</div>} />
            </Routes>
        </div>
    );
};

export default ColaboradorModule;
