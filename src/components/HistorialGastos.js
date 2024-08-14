import React, { useEffect, useState } from 'react';
import api from '../api';
import { Table, Form } from 'react-bootstrap';

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
        <div className="container mt-4">
            <h1>Historial de Gastos</h1>
            <Form.Group controlId="estadoSelect" className="mb-3">
                <Form.Label>Filtrar por Estado</Form.Label>
                <Form.Control as="select" value={estado} onChange={handleEstadoChange}>
                    <option value="">Todos</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>
                    <option value="ABONADO">ABONADO</option>
                </Form.Control>
            </Form.Group>
            <Table striped bordered hover className="table-sm">
                <thead>
                    <tr>
                        <th>RUC</th>
                        <th>Proveedor</th>
                        <th>Fecha Emisión</th>
                        <th>Moneda</th>
                        <th>Tipo Documento</th>
                        <th>Serie</th>
                        <th>Correlativo</th>
                        <th>Tipo Gasto</th>
                        <th>Sub Total</th>
                        <th>IGV</th>
                        <th>No Gravadas</th>
                        <th>Importe Facturado</th>
                        <th>TC</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.map((documento) => (
                        <tr key={documento.id}>
                            <td>{documento.ruc}</td>
                            <td>{documento.proveedor}</td>
                            <td>{documento.fecha_emision}</td>
                            <td>{documento.moneda}</td>
                            <td>{documento.tipo_documento}</td>
                            <td>{documento.serie}</td>
                            <td>{documento.correlativo}</td>
                            <td>{documento.tipo_gasto}</td>
                            <td>{documento.sub_total}</td>
                            <td>{documento.igv}</td>
                            <td>{documento.no_gravadas}</td>
                            <td>{documento.importe_facturado}</td>
                            <td>{documento.tc}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default HistorialGastos;
