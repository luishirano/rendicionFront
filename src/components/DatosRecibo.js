import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './DatosRecibo.css';

const DatosRecibo = () => {
    const location = useLocation();

    console.log(location.state);

    
    const navigate = useNavigate();
    // const { selectedCuentaContable, selectedRubro } = location.state || {};

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
        if (formData.igv) {
            const afectoValue = (parseFloat(formData.igv) / 0.18).toFixed(2);
            setFormData(prevFormData => ({
                ...prevFormData,
                afecto: afectoValue
            }));
        }
    }, [formData.igv]);

    useEffect(() => {
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
                const uploadResponse = await axios.post('http://127.0.0.1:8000/upload-file/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                const fileLocation = uploadResponse.data.file_location;
    
                const decodeResponse = await axios.post('http://localhost:8000/decode-qr/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    fecha: decodeResponse.data.fecha || '',
                    ruc: decodeResponse.data.ruc || '',
                    tipoDoc: decodeResponse.data.tipo || '',
                    serie: decodeResponse.data.serie || '',
                    numero: decodeResponse.data.numero || '',
                    igv: decodeResponse.data.igv || '',
                    total: decodeResponse.data.total || '',
                    archivo: fileLocation
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
            loggedInUser = decodedToken.sub;
        } else {
            console.error("Token not found in localStorage.");
        }

        const todayDate = new Date().toISOString().split('T')[0];

        const requestData = {
            fecha_solicitud: todayDate,
            dni: formData.dni || "12345678",
            usuario: loggedInUser,
            gerencia: "Gerencia de Finanzas",
            ruc: formData.ruc,
            proveedor: "Proveedor S.A.",
            fecha_emision: formData.fecha,
            moneda: formData.moneda || "PEN",
            tipo_documento: formData.tipoDoc,
            serie: formData.serie,
            correlativo: formData.numero,
            tipo_gasto: "Servicios",
            sub_total: parseFloat(formData.total) - parseFloat(formData.igv),
            igv: parseFloat(formData.igv),
            no_gravadas: formData.inafecto ? parseFloat(formData.inafecto) : 0.0,
            importe_facturado: parseFloat(formData.total),
            tc: formData.moneda === 'USD' ? tipoCambio : 1,
            anticipo: 0.0,
            total: parseFloat(formData.total),
            pago: parseFloat(formData.total),
            detalle: "Pago por servicios de consultoría",
            estado: "PENDIENTE",
            empresa: "innova",
            archivo: formData.archivo,
            tipo_cambio: formData.moneda === 'USD' ? tipoCambio : 1,
            afecto: parseFloat(formData.afecto) || 0.0,
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
                    archivo: ''
                });
                setTipoCambio('');
                setReceiptFile(null);
                setQrFile(null);
                setSearchRuc('');
                setSearchResult(null);
                setError('');
            } else {
                navigate('/colaborador');
            }
        } catch (error) {
            setError('Error al enviar los datos. Por favor, intente nuevamente.');
        }
    };

    return (
        <Container sx={{ marginTop: 10 }}> {/* Agregar margen superior para evitar que el Navbar tape el contenido */}
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="div" align="center" gutterBottom>
                        Datos del recibo
                    </Typography>

                    <div className="form-group row">
                        <div className="col-md-4">
                            <TextField
                                label="Buscar por RUC"
                                variant="outlined"
                                fullWidth
                                value={searchRuc}
                                onChange={handleSearchRucChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button variant="contained" color="primary" onClick={handleSearch}>
                                Buscar
                            </Button>
                        </div>
                        {/* <div className="col-md-4">
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                Subir Recibo
                                <input type="file" hidden onChange={handleReceiptFileChange} />
                            </Button>
                        </div> */}
                        <div className="col-md-4">
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                Subir Recibo
                                <input type="file" hidden onChange={handleQrFileChange} />
                            </Button>
                        </div>
                    </div>

                    {error && <Alert severity="error">{error}</Alert>}
                    {searchResult && (
                        <Alert severity="success">
                            <p><strong>Razón Social:</strong> {searchResult.razonSocial}</p>
                            <p><strong>Dirección:</strong> {searchResult.direccion}</p>
                            <p><strong>Estado:</strong> {searchResult.estado}</p>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        {['fecha', 'ruc', 'tipoDoc', 'cuentaContable', 'serie', 'numero', 'rubro', 'moneda', 'afecto', 'igv', 'inafecto', 'total'].map(field => (
                            <TextField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                InputProps={{ readOnly: field === 'afecto' }}
                                select={field === 'moneda'}
                            >
                                {field === 'moneda' && (
                                    <>
                                        <MenuItem value="PEN">PEN</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                    </>
                                )}
                            </TextField>
                        ))}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 4 }}
                        >
                            Enviar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default DatosRecibo;
