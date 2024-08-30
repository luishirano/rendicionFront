import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material'; // Importa Material-UI para el popup
import './AnticiposViajes.css';



const AnticiposViajes = () => {

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (`0${today.getMonth() + 1}`).slice(-2); // Asegura dos dígitos
        const day = (`0${today.getDate()}`).slice(-2); // Asegura dos dígitos
        return `${year}-${month}-${day}`;
    }; 

    const [formData, setFormData] = useState({
        usuario: 'colauser1@gmail.com',
        dni: '',
        responsable: '',
        gerencia: '',
        area: '',
        ceco: '',
        tipo_anticipo: '',
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
            const response = await axios.post('http://localhost:8000/documentos/crear-con-pdf/', formData);
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
        <Container className="mt-4">
            <h1 className="text-center mb-4">Anticipos de Viajes</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="dni" className="mb-3">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="dni" 
                        placeholder="Ingrese el DNI" 
                        value={formData.dni} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="responsable" className="mb-3">
                    <Form.Label>Responsable</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="responsable" 
                        placeholder="Ingrese el nombre del responsable" 
                        value={formData.responsable} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="gerencia" className="mb-3">
                    <Form.Label>Gerencia</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="gerencia" 
                        placeholder="Ingrese la gerencia" 
                        value={formData.gerencia} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="area" className="mb-3">
                    <Form.Label>Área</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="area" 
                        placeholder="Ingrese el área" 
                        value={formData.area} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="ceco" className="mb-3">
                    <Form.Label>CECO</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="ceco" 
                        placeholder="Ingrese el CECO" 
                        value={formData.ceco} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="tipoAnticipo" className="mb-3">
                    <Form.Label>Tipo de Anticipo</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="tipo_anticipo" 
                        placeholder="Ingrese el tipo de anticipo" 
                        value={formData.tipo_anticipo} 
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
                    <Form.Label>Breve Motivo</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="motivo" 
                        placeholder="Ingrese el motivo" 
                        value={formData.motivo} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="fechaViaje" className="mb-3">
                    <Form.Label>Fecha de Viaje</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="fecha_viaje" 
                        value={formData.fecha_viaje} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="dias" className="mb-3">
                    <Form.Label>Días</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="dias" 
                        placeholder="Ingrese el número de días" 
                        value={formData.dias} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="moneda" className="mb-3">
                    <Form.Label>Moneda</Form.Label>
                    <Form.Control 
                        as="select" 
                        name="moneda" 
                        value={formData.moneda} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="PEN">PEN</option>
                        <option value="USD">USD</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="presupuesto" className="mb-3">
                    <Form.Label>Presupuesto</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="presupuesto" 
                        placeholder="Ingrese el presupuesto" 
                        value={formData.presupuesto} 
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

                <Form.Group controlId="banco" className="mb-3">
                    <Form.Label>Banco</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="banco" 
                        placeholder="Ingrese el banco" 
                        value={formData.banco} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="numeroCuenta" className="mb-3">
                    <Form.Label>Número de Cuenta</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="numero_cuenta" 
                        placeholder="Ingrese el número de cuenta" 
                        value={formData.numero_cuenta} 
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

export default AnticiposViajes;
