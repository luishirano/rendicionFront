import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './DatosRecibo.css';
import { jwtDecode } from 'jwt-decode';

const DatosRecibo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedCuentaContable, selectedRubro } = location.state || {};

    const [formData, setFormData] = useState({
        fecha: '',
        ruc: '',
        tipoDoc: '',
        cuentaContable: selectedCuentaContable || '',
        serie: '',
        numero: '',
        rubro: selectedRubro || '',
        moneda: 'PEN',  // Moneda predeterminada
        afecto: '',
        igv: '',
        inafecto: '',
        total: '',
        archivo: '' // Nuevo campo para almacenar la ruta del archivo QR
    });

    const [tipoCambio, setTipoCambio] = useState('');  // Estado para manejar el tipo de cambio
    const [searchRuc, setSearchRuc] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');
    const [receiptFile, setReceiptFile] = useState(null);
    const [qrFile, setQrFile] = useState(null);

    useEffect(() => {
        // Calcular afecto cuando el valor de IGV cambia
        if (formData.igv) {
            const afectoValue = (parseFloat(formData.igv) / 0.18).toFixed(2);
            setFormData(prevFormData => ({
                ...prevFormData,
                afecto: afectoValue
            }));
        }
    }, [formData.igv]);

    useEffect(() => {
        // Si la moneda es USD, obtener el tipo de cambio
        if (formData.moneda === 'USD' && formData.fecha) {
            fetchTipoCambio(formData.fecha);
        }
    }, [formData.moneda, formData.fecha]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchTipoCambio = async (fecha) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/tipo-cambio/?fecha=${fecha}`);
            setTipoCambio(response.data.precioVenta);
        } catch (error) {
            setError('Error al obtener el tipo de cambio. Por favor, intente nuevamente.');
        }
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

    const handleQrFileChange = async (event) => {
        const file = event.target.files[0];
        setQrFile(file);
    
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                // Primero, subir el archivo
                const uploadResponse = await axios.post('http://127.0.0.1:8000/upload-file/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                const fileLocation = uploadResponse.data.file_location;
    
                // Luego, decodificar el QR
                const decodeResponse = await axios.post('http://localhost:8000/decode-qr/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                // Asignar los datos del QR al formulario y la ruta del archivo
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    fecha: decodeResponse.data.fecha || '',
                    ruc: decodeResponse.data.ruc || '',
                    tipoDoc: decodeResponse.data.tipo || '',
                    serie: decodeResponse.data.serie || '',
                    numero: decodeResponse.data.numero || '',
                    igv: decodeResponse.data.igv || '',
                    total: decodeResponse.data.total || '',
                    archivo: fileLocation // Asignar la ruta del archivo subido
                }));
    
                setError('');
            } catch (error) {
                setError('Error al procesar el QR o subir el archivo. Por favor, intente nuevamente.');
            }
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        let loggedInUser = '';

        if (token) {
            const decodedToken = jwtDecode(token);
            loggedInUser = decodedToken.sub; // Asegúrate de que "email" esté presente en el token
        } else {
            console.error("Token not found in localStorage.");
        }

        if (!loggedInUser) {
            console.error("Failed to decode token or email not found.");
        } else {
            console.log("Logged in user:", loggedInUser);
        }

        const todayDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        const requestData = {
            fecha_solicitud: todayDate,
            dni: formData.dni || "12345678", // El DNI debería ser obtenido si está disponible
            usuario: loggedInUser,
            gerencia: "Gerencia de Finanzas", // Podrías ajustar esto según sea necesario
            ruc: formData.ruc,
            proveedor: "Proveedor S.A.", // Podrías obtener esto dinámicamente
            fecha_emision: formData.fecha,
            moneda: formData.moneda || "PEN", // Asumiendo PEN si no se especifica
            tipo_documento: formData.tipoDoc,
            serie: formData.serie,
            correlativo: formData.numero,
            tipo_gasto: "Servicios", // Podrías ajustar esto según sea necesario
            sub_total: parseFloat(formData.total) - parseFloat(formData.igv), // Calcula el sub_total restando el IGV del total
            igv: parseFloat(formData.igv),
            no_gravadas: formData.inafecto ? parseFloat(formData.inafecto) : 0.0, // Si no hay inafecto, asume 0
            importe_facturado: parseFloat(formData.total),
            tc: formData.moneda === 'USD' ? tipoCambio : 4.50, // Usa el tipo de cambio obtenido o uno por defecto
            anticipo: 0.0, // Asume 0 si no se especifica
            total: parseFloat(formData.total),
            pago: parseFloat(formData.total),
            detalle: "Pago por servicios de consultoría", // Ajusta esto según sea necesario
            estado: "PENDIENTE",
            empresa: "innova",
            archivo: formData.archivo, // Añadir la ruta del archivo al request
            tipo_cambio: formData.moneda === 'USD' ? tipoCambio : 4.50, // Usa el tipo de cambio obtenido o uno por defecto
            afecto: parseFloat(formData.afecto) || 0.0, // Usar el valor calculado de afecto
            inafecto: formData.inafecto ? parseFloat(formData.inafecto) : 0.0,
            rubro: formData.rubro,
            cuenta_contable: parseInt(formData.cuentaContable, 10)
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/documentos/', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const anotherRendition = window.confirm('Datos enviados con éxito. ¿Desea registrar otra rendición?');
            if (anotherRendition) {
                // Limpiar el formulario
                setFormData({
                    fecha: '',
                    ruc: '',
                    tipoDoc: '',
                    cuentaContable: selectedCuentaContable || '',
                    serie: '',
                    numero: '',
                    rubro: selectedRubro || '',
                    moneda: 'PEN',
                    afecto: '',
                    igv: '',
                    inafecto: '',
                    total: '',
                    archivo: '' // Resetear el campo archivo
                });
                setTipoCambio(''); // Resetear el tipo de cambio
                setReceiptFile(null);
                setQrFile(null);
                setSearchRuc('');
                setSearchResult(null);
                setError('');
            } else {
                // Redirigir al módulo de colaborador
                navigate('/colaborador');
            }
        } catch (error) {
            setError('Error al enviar los datos. Por favor, intente nuevamente.');
        }
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
                        {['fecha', 'ruc', 'tipoDoc', 'cuentaContable', 'serie', 'numero', 'rubro', 'moneda', 'afecto', 'igv', 'inafecto', 'total'].map(field => (
                            <div className="form-group" key={field}>
                                <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                {field === 'moneda' ? (
                                    <select
                                        className="form-control"
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                    >
                                        <option value="PEN">PEN</option>
                                        <option value="USD">USD</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        readOnly={field === 'afecto'} // Campo afecto es de solo lectura
                                    />
                                )}
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
