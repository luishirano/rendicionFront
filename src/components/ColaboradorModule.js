import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import api from '../api';
import Home from './Home';
import RendicionGastos from './RendicionGastos';
import HistorialGastos from './HistorialGastos';
import DatosRecibo from './DatosRecibo'; // Importar el componente DatosRecibo
import 'bootstrap/dist/css/bootstrap.min.css';
import './ColaboradorModule.css'; // Asegúrate de tener este archivo en la misma carpeta

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
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/rendicion-gastos" element={<RendicionGastos />} />
                        <Route path="/historial" element={<HistorialGastos username={user.email} companyName={user.company_name} />} />
                        <Route path="/datos-recibo" element={<DatosRecibo />} /> {/* Agregar la nueva ruta */}
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ColaboradorModule;
