import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';
import './Movilidad.css'; // Importa tu archivo CSS personalizado

const Movilidad = () => {
    const [formData, setFormData] = useState({
        fecha: '',
        origen: '',
        destino: '',
        motivo: '',
        gastoDeducible: '',
        gastoNoDeducible: '',
        total: ''
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
            const response = await axios.post('http://127.0.0.1:8000/documentos/', formData);
            setResponseMessage('Documento creado correctamente.');
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
        <Container className="mt-4">
            <h1 className="text-center mb-4">Gastos Movilidad</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="fecha" className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="fecha" 
                        value={formData.fecha} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="origen" className="mb-3">
                    <Form.Label>Origen</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="origen" 
                        placeholder="Ingrese el origen" 
                        value={formData.origen} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="destino" className="mb-3">
                    <Form.Label>Destino</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="destino" 
                        placeholder="Ingrese el destino" 
                        value={formData.destino} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="motivo" className="mb-3">
                    <Form.Label>Motivo</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="motivo" 
                        placeholder="Ingrese el motivo del viaje" 
                        value={formData.motivo} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="gastoDeducible" className="mb-3">
                    <Form.Label>Gasto Deducible</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="gastoDeducible" 
                        placeholder="Ingrese el gasto deducible" 
                        value={formData.gastoDeducible} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="gastoNoDeducible" className="mb-3">
                    <Form.Label>Gasto No Deducible</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="gastoNoDeducible" 
                        placeholder="Ingrese el gasto no deducible" 
                        value={formData.gastoNoDeducible} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="total" className="mb-3">
                    <Form.Label>Total</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="total" 
                        placeholder="Ingrese el total" 
                        value={formData.total} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-block" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
            </Form>

            {/* Popup de Material-UI */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Registro Exitoso</DialogTitle>
                <DialogContent>
                    <p>{responseMessage}</p>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleClose} color="primary">
                        OK
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Movilidad;
