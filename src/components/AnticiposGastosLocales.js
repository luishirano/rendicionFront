import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import './AnticiposGastosLocales.css'; // Puedes crear un archivo CSS personalizado si es necesario

const AnticiposGastosLocales = () => {
    const [formData, setFormData] = useState({
        dni: '',
        responsable: '',
        gerencia: '',
        area: '',
        ceco: '',
        motivo: '',
        moneda: 'PEN',  // Valor predeterminado
        presupuesto: '',
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
            <h1 className="text-center mb-4">Anticipos Gastos Locales</h1>
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

export default AnticiposGastosLocales;
