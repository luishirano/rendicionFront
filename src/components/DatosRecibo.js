import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, Alert, MenuItem, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './DatosRecibo.css';

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
        archivo: '' // Nuevo campo para almacenar la ruta del archivo
    });

    const [tipoCambio, setTipoCambio] = useState('');
    const [searchRuc, setSearchRuc] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');
    const [qrFile, setQrFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el loader
    const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar el popup
    const [isFormReset, setIsFormReset] = useState(false); // Para saber si el formulario se reinicia

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
           // const response = await axios.get(`http://localhost:8000/tipo-cambio/?fecha=${fecha}`);
            const response = await axios.get(`https://rendicion-production.up.railway.app/tipo-cambio/?fecha=${fecha}`);
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
          //  const response = await axios.get(`http://localhost:8000/consulta-ruc?ruc=${searchRuc}`);
            const response = await axios.get(`https://rendicion-production.up.railway.app/consulta-ruc?ruc=${searchRuc}`);    
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

    const handleQrFileChange = async (event) => {
        const file = event.target.files[0];
        setQrFile(file);

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setIsLoading(true); // Inicia el estado de carga

            try {
                 //const uploadResponse = await axios.post('http://localhost:8000/upload-file-firebase/', formData, {
                const uploadResponse = await axios.post('https://rendicion-production.up.railway.app/upload-file-firebase/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const fileLocation = uploadResponse.data.file_url;

                //const decodeResponse = await axios.post('http://localhost:8000/decode-qr/', formData, {
                const decodeResponse = await axios.post('https://rendicion-production.up.railway.app/decode-qr/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (decodeResponse.data.detail === "No QR code found in the image") {
                    // Si el QR no es válido, muestra un error
                    setError('No se encontró un código QR en la imagen. Por favor, intente con otra imagen.');
                } else {
                    // Si hay datos válidos, rellena el formulario
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
                    setError(''); // Limpia el error si hay datos
                }
            } catch (error) {
                setError('Error al procesar el QR o subir el archivo. Por favor, intente nuevamente.');
            } finally {
                setIsLoading(false); // Termina el estado de carga
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
            tipo_solicitud: "GASTO",
            empresa: "innova",
            archivo: formData.archivo,
            tipo_cambio: formData.moneda === 'USD' ? tipoCambio : 1,
            afecto: parseFloat(formData.afecto) || 0.0,
            inafecto: formData.inafecto ? parseFloat(formData.inafecto) : 0.0,
            rubro: formData.rubro,
            cuenta_contable: parseInt(formData.cuentaContable, 10)
        };

        try {
           //  await axios.post('http://localhost:8000/documentos/', requestData, {
             await axios.post('https://rendicion-production.up.railway.app/documentos/', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Mostrar el diálogo de éxito
            setDialogOpen(true);
        } catch (error) {
            setError('Error al enviar los datos. Por favor, intente nuevamente.');
        }
    };

    const handleDialogClose = (registerAnother) => {
        setDialogOpen(false);
        if (registerAnother) {
            // Reiniciar el formulario
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
            setQrFile(null);
            setSearchRuc('');
            setSearchResult(null);
            setError('');
        } else {
            // Navegar de vuelta si no desea registrar otra rendición
            navigate('/colaborador');
        }
    };

    return (
        <Container sx={{ marginTop: 10 }}>
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

                    {isLoading ? ( // Mostrar un indicador de carga cuando esté procesando el QR
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <>
                            {error && <Alert severity="error">{error}</Alert>}
                            {searchResult && (
                                <Alert severity="success">
                                    <p><strong>Razón Social:</strong> {searchResult.razonSocial}</p>
                                    <p><strong>Dirección:</strong> {searchResult.direccion}</p>
                                    <p><strong>Estado:</strong> {searchResult.estado}</p>
                                </Alert>
                            )}
                        </>
                    )}

                    {/* <form onSubmit={handleSubmit}>
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
                    </form> */}



                    <form onSubmit={handleSubmit}>
                        {['fecha', 'ruc', 'tipoDoc', 'cuentaContable', 'serie', 'numero', 'rubro'].map(field => (
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
                            />
                        ))}

                        {/* Campo de Moneda antes de Afecto */}
                        <TextField
                            label="Moneda"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            id="moneda"
                            name="moneda"
                            value={formData.moneda}
                            onChange={handleChange}
                            select
                        >
                            <MenuItem value="PEN">PEN</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                        </TextField>

                        {/* Campo Afecto solo lectura */}
                        <TextField
                            label="Afecto"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            id="afecto"
                            name="afecto"
                            value={formData.afecto}
                            InputProps={{ readOnly: true }}  // Campo solo lectura
                        />

                        {['igv', 'inafecto', 'total'].map(field => (
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
                            />
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

            {/* Diálogo de confirmación con Material UI */}
            <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
                <DialogTitle>Datos enviados con éxito</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Documento creado correctamente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false)} color="secondary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DatosRecibo;
