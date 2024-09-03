import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import './AnticiposGastosLocales.css'; // Mantén tu archivo CSS personalizado si es necesario

const AnticiposGastosLocales = () => {
    const [formData, setFormData] = useState({
        dni: '',
        responsable: '',
        gerencia: '',
        tipo_anticipo: 'VIAJES',
        empresa: 'innova',
        estado: 'PENDIENTE',
        area: '',
        ceco: '',
        motivo: '',
        moneda: 'PEN',
        presupuesto: '',
        banco: '',
        numero_cuenta: ''  // Asegúrate de que la clave coincide con el name del input
    });

    const [responseMessage, setResponseMessage] = useState(''); // Para manejar la respuesta de la API
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const [open, setOpen] = useState(false); // Estado para controlar el popup

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
            const response = await axios.post('http://localhost:8000/documentos/crear-con-pdf-local/', formData);
            setResponseMessage('Documento creado y guardado en PDF correctamente.');
            setOpen(true); // Abre el popup cuando se crea el documento exitosamente
        } catch (error) {
            setResponseMessage('Error al crear el documento.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        window.history.back(); // Retrocede una vez en el historial del navegador
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 10 }}> {/* Ajustar el padding superior */}
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Anticipos Gastos Locales
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
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
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="responsable"
                            label="Responsable"
                            name="responsable"
                            value={formData.responsable}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="gerencia"
                            label="Gerencia"
                            name="gerencia"
                            value={formData.gerencia}
                            onChange={handleChange}
                        />
                        <TextField
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
                        />
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
        </Container>
    );
};

export default AnticiposGastosLocales;
