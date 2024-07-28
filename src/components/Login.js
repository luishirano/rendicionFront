// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/token', { email, password });
            localStorage.setItem('token', response.data.access_token);
            const userResponse = await api.get('/users/me/');
            const user = userResponse.data;
            if (user.role === 'contador') {
                navigate('/contador');
            } else if (user.role === 'colaborador') {
                navigate('/colaborador');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{ padding: '10px', margin: '5px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{ padding: '10px', margin: '5px' }}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
