import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material';

const HistorialGastos = ({ username, companyName }) => {
    const [documentos, setDocumentos] = useState([]);
    const [estado, setEstado] = useState('');

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await api.get('/documentos', {
                    params: {
                        company_name: companyName,
                        estado: estado,
                        username: username,
                    },
                });
                setDocumentos(response.data);
            } catch (error) {
                console.error('Error fetching documentos:', error);
            }
        };

        fetchDocumentos();
    }, [username, companyName, estado]);

    const handleEstadoChange = (e) => {
        setEstado(e.target.value);
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Historial de Gastos
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
                <InputLabel id="estado-label">Filtrar por Estado</InputLabel>
                <Select
                    labelId="estado-label"
                    id="estadoSelect"
                    value={estado}
                    label="Filtrar por Estado"
                    onChange={handleEstadoChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                    <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                    <MenuItem value="ABONADO">ABONADO</MenuItem>
                </Select>
            </FormControl>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">RUC</TableCell>
                            <TableCell align="center">Proveedor</TableCell>
                            <TableCell align="center">Fecha Emisión</TableCell>
                            <TableCell align="center">Moneda</TableCell>
                            <TableCell align="center">Tipo Documento</TableCell>
                            <TableCell align="center">Serie</TableCell>
                            <TableCell align="center">Correlativo</TableCell>
                            <TableCell align="center">Tipo Gasto</TableCell>
                            <TableCell align="center">Sub Total</TableCell>
                            <TableCell align="center">IGV</TableCell>
                            <TableCell align="center">No Gravadas</TableCell>
                            <TableCell align="center">Importe Facturado</TableCell>
                            <TableCell align="center">TC</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documentos.map((documento) => (
                            <TableRow key={documento.id}>
                                <TableCell align="center">{documento.ruc}</TableCell>
                                <TableCell align="center">{documento.proveedor}</TableCell>
                                <TableCell align="center">{documento.fecha_emision}</TableCell>
                                <TableCell align="center">{documento.moneda}</TableCell>
                                <TableCell align="center">{documento.tipo_documento}</TableCell>
                                <TableCell align="center">{documento.serie}</TableCell>
                                <TableCell align="center">{documento.correlativo}</TableCell>
                                <TableCell align="center">{documento.tipo_gasto}</TableCell>
                                <TableCell align="center">{documento.sub_total}</TableCell>
                                <TableCell align="center">{documento.igv}</TableCell>
                                <TableCell align="center">{documento.no_gravadas}</TableCell>
                                <TableCell align="center">{documento.importe_facturado}</TableCell>
                                <TableCell align="center">{documento.tc}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default HistorialGastos;
