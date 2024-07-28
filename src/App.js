// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ContadorModule from './components/ContadorModule';
import ColaboradorModule from './components/ColaboradorModule';
import Home from './components/Home';
import RendicionGastos from './components/RendicionGastos';
import './index.css';

function App() {
    const user = {
        role: 'colaborador',  // Esto debería ser dinámico basado en la autenticación real
        full_name: 'Luis'
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/contador" element={<ContadorModule user={user} />} />
                <Route path="/colaborador/*" element={<ColaboradorModule user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;
