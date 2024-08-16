import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import './AnticiposViajes.css'; // Puedes crear un archivo CSS personalizado si es necesario

const AnticiposViajes = () => {
    const [formData, setFormData] = useState({
        dni: '',
        responsable: '',
        gerencia: '',
        area: '',
        ceco: '',
        tipoAnticipo: '',
        destino: '',
        motivo: '',
        fechaViaje: '',
        dias: '',
        moneda: 'PEN',  // Valor predeterminado
        presupuesto: '',
        total: '',
        banco: '',
        numeroCuenta: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar el envío del formulario
        console.log(formData);
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
                        name="tipoAnticipo" 
                        placeholder="Ingrese el tipo de anticipo" 
                        value={formData.tipoAnticipo} 
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
                        name="fechaViaje" 
                        value={formData.fechaViaje} 
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
                        name="numeroCuenta" 
                        placeholder="Ingrese el número de cuenta" 
                        value={formData.numeroCuenta} 
                        onChange={handleChange} 
                        required 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-block">
                    Enviar
                </Button>
            </Form>
        </Container>
    );
};

export default AnticiposViajes;
