import React, { useEffect, useState } from 'react';
import api, { getUsersByCompanyAndRole } from '../api';
import { Table, Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import './ContadorModule.css'; // Importa tu archivo CSS personalizado

const ContadorModule = () => {
    const [user, setUser] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [empresa, setEmpresa] = useState('');
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedColaborador, setSelectedColaborador] = useState(null);
    const [filtros, setFiltros] = useState({
        colaborador: '',
        estado: 'PENDIENTE',
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
        const fetchColaboradores = async () => {
            if (empresa) {
                const colaboradores = await getUsersByCompanyAndRole(empresa, 'colaborador');
                setColaboradores(colaboradores);
            }
        };
        fetchColaboradores();
    }, [empresa]);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                if (empresa) {
                    const response = await api.get(`/documentos`, {
                        params: {
                            company_name: empresa,
                            estado: filtros.estado,
                            username: filtros.colaborador,
                        },
                    });
                    setDocumentos(response.data);
                }
            } catch (error) {
                console.error('Error fetching documentos:', error);
            }
        };

        fetchDocumentos();
    }, [empresa, filtros.estado, filtros.colaborador]);

    const handleFiltroChange = async (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
        });

        if (name === 'colaborador' && value) {
            const colaborador = colaboradores.find(col => col.email === value);
            setSelectedColaborador(colaborador);
        } else if (name === 'colaborador' && !value) {
            setSelectedColaborador(null);
        }
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

    const handleViewFile = async (documento) => {
        setSelectedDocumento(documento);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDocumento(null);
    };

    const handleDownloadFile = async (fileLocation) => {
        const response = await api.get(`/documentos/download/`, {
            params: { file_location: fileLocation },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileLocation.split('/').pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = async () => {
        const params = {
            company_name: empresa,
            estado: filtros.estado,
            username: filtros.colaborador,
        };
        const response = await api.get('/documentos/export/excel', { params, responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'documentos.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = async () => {
        const params = {
            company_name: empresa,
            estado: filtros.estado,
            username: filtros.colaborador,
        };
        const response = await api.get('/documentos/export/pdf', { params, responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'documentos.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Container fluid className="mt-5">
            {/* <h1>Contador</h1> */}
            {selectedColaborador && (
                <div className="mb-4">
                    <Row>
                        <Col>
                            <p><strong>Nombre:</strong> {selectedColaborador.full_name}</p>
                        </Col>
                        <Col>
                            <p><strong>Email:</strong> {selectedColaborador.email}</p>
                        </Col>
                        <Col>
                            <p><strong>Compañía:</strong> {selectedColaborador.company_name}</p>
                        </Col>
                        <Col>
                            <Button variant="danger" onClick={handleExportPDF}>Exportar PDF</Button>
                            <Button variant="primary" onClick={handleExportExcel} className="ms-2">Exportar Excel</Button>
                        </Col>
                    </Row>
                </div>
            )}
            <Form className="mb-4">
                <Row>
                    <Col>
                        <Form.Control
                            as="select"
                            name="colaborador"
                            value={filtros.colaborador}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Buscar por colaborador</option>
                            {colaboradores.map(colaborador => (
                                <option key={colaborador.id} value={colaborador.email}>
                                    {colaborador.full_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Control
                            as="select"
                            name="estado"
                            value={filtros.estado}
                            onChange={handleFiltroChange}
                        >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="APROBADO">APROBADO</option>
                            <option value="RENDIDO">RENDIDO</option>
                            <option value="RECHAZADO">RECHAZADO</option>
                        </Form.Control>
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
            <Table striped bordered hover className="table-sm">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Fecha</th>
                        <th>RUC</th>
                        <th>Tipo Doc</th>
                        <th>Cuenta Contable</th>
                        <th>Serie</th>
                        <th>Correlativo</th>
                        <th>Rubro</th>
                        <th>Moneda</th>
                        <th>Tipo de Cambio</th>
                        <th>Afecto</th>
                        <th>IGV</th>
                        <th>Inafecto</th>
                        <th>Total</th>
                        <th>Archivo</th>
                        <th>Actualizar Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.filter(doc => 
                        (!filtros.colaborador || doc.usuario.includes(filtros.colaborador)) &&
                        (!filtros.estado || doc.estado.includes(filtros.estado)) &&
                        (!filtros.fechaRegistro || doc.fecha_solicitud.includes(filtros.fechaRegistro))
                    ).map((documento, index) => (
                        <tr key={documento.id}>
                            <td>{index + 1}</td>
                            <td>{documento.fecha_emision}</td>
                            <td>{documento.ruc}</td>
                            <td>{documento.tipo_documento}</td>
                            <td>{documento.cuenta_contable}</td>
                            <td>{documento.serie}</td>
                            <td>{documento.correlativo}</td>
                            <td>{documento.rubro}</td>
                            <td>{documento.moneda}</td>
                            <td>{documento.tipo_cambio}</td>
                            <td>{documento.afecto}</td>
                            <td>{documento.igv}</td>
                            <td>{documento.inafecto}</td>
                            <td>{documento.total}</td>
                            <td>
                                {documento.archivo && (
                                    <Button variant="link" onClick={() => handleViewFile(documento)}>
                                        Ver Archivo
                                    </Button>
                                )}
                            </td>
                            <td>
                                <Form.Control
                                    as="select"
                                    value={documento.estado}
                                    onChange={(e) => handleEstadoChange(documento.id, e.target.value)}
                                >
                                     <option value="PENDIENTE">PENDIENTE</option>
                                     <option value="APROBADO">APROBADO</option>
                                     <option value="RENDIDO">RENDIDO</option>
                                     <option value="RECHAZADO">RECHAZADO</option>
                                </Form.Control>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedDocumento && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Archivo del Documento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedDocumento.archivo && (
                            <iframe
                                src={`http://127.0.0.1:8000/documentos/view/?file_location=${encodeURIComponent(selectedDocumento.archivo)}`}
                                width="100%"
                                height="600px"
                                title="Archivo del Documento"
                                frameBorder="0"
                            />
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={() => handleDownloadFile(selectedDocumento.archivo)}>
                            Descargar Archivo
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default ContadorModule;
