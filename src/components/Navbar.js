import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo from '../assets/images/logo.png';
import api from '../api'; // Asegúrate de tener esta configuración para realizar llamadas a tu API

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userResponse = await api.get('/users/me/');
                    setUser(userResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
                localStorage.removeItem('token');
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="logo" sx={{ marginLeft: '10px' }}>
                    <Link to="/">
                        <img src={logo} alt="Logo" style={{ height: '50px' }} />
                    </Link>
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: '10px' }}>
                    {/* Aquí podrías poner el nombre de la aplicación o dejarlo en blanco */}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Typography variant="body1" sx={{ marginRight: 2 }}>
                                {user.full_name}
                            </Typography>
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={handleLogout}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : null}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
