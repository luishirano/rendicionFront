import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './DatosRecibo.css';

const DatosRecibo = () => {
    const location = useLocation();
    const { selectedCuentaContable, selectedRubro } = location.state || {};

    const [formData, setFormData] = useState({
        fecha: '',
        ruc: '',
        tipoDoc: '',
        cuentaContable: selectedCuentaContable || '',
        serie: '',
        numero: '',
        rubro: selectedRubro || '',
        moneda: '',
        tipoCambio: '',
        afecto: '',
        igv: '',
        inafecto: '',
        total: ''
    });

    const [searchRuc, setSearchRuc] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');
    const [receiptFile, setReceiptFile] = useState(null);
    const [qrFile, setQrFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSearchRucChange = (e) => {
        setSearchRuc(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/consulta-ruc?ruc=${searchRuc}`);
            setSearchResult(response.data);
            setFormData({
                ...formData,
                ruc: searchRuc,
                tipoDoc: response.data.tipoDocumento,
            });
            setError('');
        } catch (error) {
            setError('Error al buscar el RUC. Asegúrese de que el número es válido.');
            setSearchResult(null);
        }
    };

    const handleReceiptFileChange = (event) => {
        setReceiptFile(event.target.files[0]);
    };

    const handleQrFileChange = (event) => {
        setQrFile(event.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para manejar el envío del formulario
        alert('Datos enviados');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                    <h1 className="card-title text-center mb-4">Datos del recibo</h1>
                    <div className="form-group row">
                        <div className="col-md-4">
                            <label htmlFor="searchRuc" className="form-label">Buscar por RUC</label>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchRuc"
                                    value={searchRuc}
                                    onChange={handleSearchRucChange}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="receiptFile" className="form-label">Adjuntar recibo</label>
                            <label className="custom-file-upload">
                                <input type="file" id="receiptFile" onChange={handleReceiptFileChange} />
                                Subir Recibo
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="qrFile" className="form-label">Adjuntar QR</label>
                            <label className="custom-file-upload">
                                <input type="file" id="qrFile" onChange={handleQrFileChange} />
                                Subir QR
                            </label>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {searchResult && (
                        <div className="alert alert-success">
                            <p><strong>Razón Social:</strong> {searchResult.razonSocial}</p>
                            <p><strong>Dirección:</strong> {searchResult.direccion}</p>
                            <p><strong>Estado:</strong> {searchResult.estado}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        {['fecha', 'ruc', 'tipoDoc', 'cuentaContable', 'serie', 'numero', 'rubro', 'moneda', 'tipoCambio', 'afecto', 'igv', 'inafecto', 'total'].map(field => (
                            <div className="form-group" key={field}>
                                <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary btn-block mt-4">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DatosRecibo;
