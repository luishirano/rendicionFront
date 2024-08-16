import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap si aún no está importado
import './Home.css'; // Importar el archivo CSS

const Home = ({ user }) => {
    const navigate = useNavigate();

    const handleRendicionClick = () => {
        navigate('/colaborador/rendicion-gastos');
    };

    const handleHistorialClick = () => {
        navigate('/colaborador/historial');
    };

    const handleMovilidadClick = () => {
        navigate('/colaborador/movilidad');
    };

    const handleAnticiposViajesClick = () => {
        navigate('/colaborador/anticipos-viajes');
    };

    const handleAnticiposGastosLocalesClick = () => {
        navigate('/colaborador/anticipos-gastos-locales');
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="home-container">
            <div className="home-card">
                <h1 className="home-title">Bienvenido, {user.full_name}</h1>
                <button className="btn home-button" onClick={handleRendicionClick}>
                    Rendición de Gastos
                </button>
                <button className="btn home-button" onClick={handleHistorialClick}>
                    Historial
                </button>
                <button className="btn home-button" onClick={handleMovilidadClick}>
                    Movilidad
                </button>
                <button className="btn home-button" onClick={handleAnticiposViajesClick}>
                    Anticipos Viajes
                </button>
                <button className="btn home-button" onClick={handleAnticiposGastosLocalesClick}>
                    Anticipos Gastos Locales
                </button>
            </div>
        </div>
    );
};

export default Home;
