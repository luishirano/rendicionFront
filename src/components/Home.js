// src/components/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
    const navigate = useNavigate();

    const handleRendicionClick = () => {
        navigate('/colaborador/rendicion-gastos');
    };

    const handleHistorialClick = () => {
        navigate('/colaborador/historial');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Bienvenido, {user.full_name}</h1>
            <button style={{ display: 'block', margin: '20px auto' }} onClick={handleRendicionClick}>
                Rendición de Gastos
            </button>
            <button style={{ display: 'block', margin: '20px auto' }} onClick={handleHistorialClick}>
                Historial
            </button>
        </div>
    );
};

export default Home;
