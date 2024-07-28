// src/components/ContadorModule.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';

const ContadorModule = () => {
    const [user, setUser] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [empresa, setEmpresa] = useState('');
    const [filtros, setFiltros] = useState({
        colaborador: '',
        estado: '',
        fechaRegistro: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const response = await api.get('/users/me/');
            setUser(response.data);
            setEmpresa(response.data.company_name);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await api.get(`/documentos?empresa=${empresa}`);
                setDocumentos(response.data);
            } catch (error) {
                console.error('Error fetching documentos:', error);
            }
        };

        if (empresa) {
            fetchDocumentos();
        }
    }, [empresa]);

    const handleFiltroChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value,
        });
    };

    const handleEstadoChange = async (documentoId, nuevoEstado) => {
        try {
            await api.put(`/documentos/${documentoId}`, { estado: nuevoEstado });
            setDocumentos(documentos.map(doc =>
                doc.id === documentoId ? { ...doc, estado: nuevoEstado } : doc
            ));
        } catch (error) {
            console.error('Error updating estado:', error);
        }
    };

    return (
        <Container className="mt-5">
            <h1>Módulo del Contador</h1>
            {user && (
                <div className="mb-4">
                    <p><strong>Nombre:</strong> {user.full_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Compañía:</strong> {user.company_name}</p>
                </div>
            )}
            <Form className="mb-4">
                <Row>
                    <Col>
                        <Form.Control
                            type="text"
                            name="colaborador"
                            placeholder="Buscar por colaborador"
                            value={filtros.colaborador}
                            onChange={handleFiltroChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            name="estado"
                            placeholder="Estado"
                            value={filtros.estado}
                            onChange={handleFiltroChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="date"
                            name="fechaRegistro"
                            placeholder="Fecha de Registro"
                            value={filtros.fechaRegistro}
                            onChange={handleFiltroChange}
                        />
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Fecha Solicitud</th>
                        <th>DNI</th>
                        <th>Usuario</th>
                        <th>Gerencia</th>
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
                        <th>Anticipo</th>
                        <th>Total</th>
                        <th>Pago</th>
                        <th>Detalle</th>
                        <th>Estado</th>
                        <th>Empresa</th>
                        <th>Actualizar Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.filter(doc => 
                        (!filtros.colaborador || doc.usuario.includes(filtros.colaborador)) &&
                        (!filtros.estado || doc.estado.includes(filtros.estado)) &&
                        (!filtros.fechaRegistro || doc.fecha_solicitud.includes(filtros.fechaRegistro))
                    ).map((documento) => (
                        <tr key={documento.id}>
                            <td>{documento.fecha_solicitud}</td>
                            <td>{documento.dni}</td>
                            <td>{documento.usuario}</td>
                            <td>{documento.gerencia}</td>
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
                            <td>{documento.anticipo}</td>
                            <td>{documento.total}</td>
                            <td>{documento.pago}</td>
                            <td>{documento.detalle}</td>
                            <td>{documento.estado}</td>
                            <td>{documento.empresa}</td>
                            <td>
                                <Form.Control
                                    as="select"
                                    value={documento.estado}
                                    onChange={(e) => handleEstadoChange(documento.id, e.target.value)}
                                >
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="EN PROCESO">EN PROCESO</option>
                                    <option value="PAGADO">PAGADO</option>
                                </Form.Control>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ContadorModule;
