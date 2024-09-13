import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';
import './AnticiposViajes.css'; // Mantén tu archivo CSS personalizado si es necesario

const AnticiposViajes = () => {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (`0${today.getMonth() + 1}`).slice(-2); // Asegura dos dígitos
        const day = (`0${today.getDate()}`).slice(-2); // Asegura dos dígitos
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        usuario: '', // El usuario autenticado
        dni: '',
        responsable: '',
        gerencia: '',
        area: '',
        ceco: '',
        tipo_anticipo: 'VIAJES',
        destino: '',
        motivo: '',
        empresa: 'innova',
        estado: 'PENDIENTE',
        fecha_viaje: '',
        dias: '',
        moneda: 'PEN',
        presupuesto: '',
        total: '',
        banco: '',
        numero_cuenta: '',
        fecha_solicitud: getCurrentDate()
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Obtener la información del usuario autenticado al cargar el componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token esté en localStorage
                    }
                });

                const userData = response.data;
                // Actualiza los datos del formulario con la información del usuario
                setFormData({
                    ...formData,
                    usuario: userData.email,
                    dni: userData.dni,
                    responsable: userData.full_name,
                    gerencia: userData.gerencia,
                    area: userData.area,
                    ceco: userData.ceco,
                    banco: userData.banco || '', // Si no hay banco, dejar vacío
                    numero_cuenta: userData.cuenta_bancaria || '',
                    fecha_emision: getCurrentDate(),
                    tipo_solicitud: "ANTICIPO",
                    tipo_anticipo: "VIAJES"
                });
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        fetchUserData();
    }, []); // Se ejecuta solo una vez cuando el componente se monta

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Cambiar la URL para apuntar a la nueva API
            const response = await axios.post('http://localhost:8000/documentos/crear-con-pdf-custom/', formData);
            setResponseMessage('Anticipo creado correctamente');
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
        <Container maxWidth="sm" sx={{ marginTop: 10 }}>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Anticipos de Viajes
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="dni"
                            label="DNI"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            autoFocus
                        /> */}
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="responsable"
                            label="Responsable"
                            name="responsable"
                            value={formData.responsable}
                            onChange={handleChange}
                        /> */}
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="gerencia"
                            label="Gerencia"
                            name="gerencia"
                            value={formData.gerencia}
                            onChange={handleChange}
                        /> */}
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="area"
                            label="Área"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="ceco"
                            label="CECO"
                            name="ceco"
                            value={formData.ceco}
                            onChange={handleChange}
                        /> */}
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="tipo_anticipo"
                            label="Tipo de Anticipo"
                            name="tipo_anticipo"
                            value={formData.tipo_anticipo}
                            onChange={handleChange}
                        /> */}
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
                            label="Breve Motivo"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="fecha_viaje"
                            label="Fecha de Viaje"
                            name="fecha_viaje"
                            type="date"
                            InputLabelProps={{
                                shrink: true, // Esto asegura que la etiqueta se mantenga visible
                            }}
                            value={formData.fecha_viaje}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="dias"
                            label="Días"
                            name="dias"
                            type="number"
                            value={formData.dias}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="moneda"
                            label="Moneda"
                            name="moneda"
                            select
                            SelectProps={{
                                native: true,
                            }}
                            value={formData.moneda}
                            onChange={handleChange}
                        >
                            <option value="PEN">PEN</option>
                            <option value="USD">USD</option>
                        </TextField>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="presupuesto"
                            label="Presupuesto"
                            name="presupuesto"
                            type="number"
                            value={formData.presupuesto}
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
                        />
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="banco"
                            label="Banco"
                            name="banco"
                            value={formData.banco}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="numero_cuenta"
                            label="Número de Cuenta"
                            name="numero_cuenta"
                            value={formData.numero_cuenta}
                            onChange={handleChange}
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
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
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
};

export default AnticiposViajes;
