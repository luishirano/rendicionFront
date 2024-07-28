// src/components/RendicionGastos.js

import React, { useState } from 'react';

const RendicionGastos = () => {
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = () => {
        // Lógica para procesar la rendición de gastos
        alert('Procesando rendición de gastos');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Rendición de Gastos</h1>
            <div>
                <select value={category} onChange={handleCategoryChange}>
                    <option value="" disabled>Seleccione una categoría</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Combustible">Combustible</option>
                    <option value="Hospedaje">Hospedaje</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
            <div style={{ margin: '20px auto' }}>
                <input type="file" onChange={handleFileChange} />
            </div>
            <button onClick={handleSubmit}>
                Procesar
            </button>
        </div>
    );
};

export default RendicionGastos;
