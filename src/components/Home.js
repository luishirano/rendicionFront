import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap si aún no está importado

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
        <div className="text-center mt-5">
            <h1>Bienvenido, {user.full_name}</h1>
            <button className="btn btn-primary m-2" onClick={handleRendicionClick}>
                Rendición de Gastos
            </button>
            <button className="btn btn-secondary m-2" onClick={handleHistorialClick}>
                Historial
            </button>
        </div>
    );
};

export default Home;
