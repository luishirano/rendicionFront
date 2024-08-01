// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar el mensaje de error
        try {
            const response = await api.post('/token', { email, password });
            localStorage.setItem('token', response.data.access_token);
            const userResponse = await api.get('/users/me/');
            const user = userResponse.data;
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'contador') {
                navigate('/contador');
            } else if (user.role === 'colaborador') {
                navigate('/colaborador');
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('El usuario o la contraseña no son correctos.');
        }
    };

    return (
        <Container className="mt-5">
            <div className="text-center mb-4">
                <h1 style={{ color: '#0056b3' }}>Registre sus datos</h1>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ingrese su email"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingrese su contraseña"
                        required
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    style={{ backgroundColor: '#0056b3', borderColor: '#0056b3', marginBottom: '10px' }}
                    block
                >
                    Iniciar Sesión
                </Button>
            </Form>
        </Container>
    );
};

export default Login;
