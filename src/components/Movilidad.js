import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import './Movilidad.css'; 

const Movilidad = () => {
    const [formData, setFormData] = useState({
        origen: '',
        destino: '',
        motivo: '',
        estado: 'PENDIENTE',
        tipo_gasto: 'LOCAL',
        gastoDeducible: '',
        gastoNoDeducible: '',
        empresa: 'innova',
        moneda: 'PEN',
        total: '',
        cuenta_contable: 63112,
        rubro: 'Servicio transporte De pasajeros'
    });

    const [responseMessage, setResponseMessage] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [open, setOpen] = useState(false); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const deducible = parseFloat(formData.gastoDeducible) || 0;
        const noDeducible = parseFloat(formData.gastoNoDeducible) || 0;
        setFormData((prevFormData) => ({
            ...prevFormData,
            total: deducible + noDeducible
        }));
    }, [formData.gastoDeducible, formData.gastoNoDeducible]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem('token');
        let loggedInUser = '';

        if (token) {
            const decodedToken = jwtDecode(token);
            loggedInUser = decodedToken.sub;
        } else {
            console.error("Token not found in localStorage.");
        }

        const today = new Date().toISOString().split('T')[0]; 
        const dataToSend = { 
            ...formData, 
            fecha_solicitud: today,
            fecha_emision: today,
            usuario: loggedInUser 
        };

        try {
            await axios.post('http://127.0.0.1:8000/documentos/', dataToSend);
            setResponseMessage('Documento creado correctamente.');
            setOpen(true); 
        } catch (error) {
            setResponseMessage('Error al crear el documento.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        window.history.back(); 
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 10 }}> {/* Ajustar el margen superior */}
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="div" align="center" gutterBottom>
                        Gastos de Movilidad
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="origen"
                            label="Origen"
                            name="origen"
                            value={formData.origen}
                            onChange={handleChange}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="destino"
                            label="Destino"
                            name="destino"
                            value={formData.destino}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="motivo"
                            label="Motivo"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="gastoDeducible"
                            label="Gasto Deducible"
                            name="gastoDeducible"
                            type="number"
                            value={formData.gastoDeducible}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="gastoNoDeducible"
                            label="Gasto No Deducible"
                            name="gastoNoDeducible"
                            type="number"
                            value={formData.gastoNoDeducible}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="total"
                            label="Total"
                            name="total"
                            type="number"
                            value={formData.total}
                            onChange={handleChange}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            sx={{ marginTop: 4 }}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Registro Exitoso</DialogTitle>
                <DialogContent>
                    <Typography>{responseMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Movilidad;
