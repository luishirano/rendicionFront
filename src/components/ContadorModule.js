import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Grid, 
    Typography, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    TextField, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Modal, 
    Box 
} from '@mui/material';
import api, { getUsersByCompanyAndRole } from '../api';
import lupaIcon from '../assets/lupa-icon.png'; // Asegúrate de tener esta imagen en la carpeta 'assets'

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
        tipo_gasto: 'LOCAL',
        tipo_documento: '',
        tipo_anticipo: '',
        fechaDesde: '',
        fechaHasta: ''
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
                            tipo_gasto: filtros.tipo_gasto,
                            tipo_documento: filtros.tipo_documento,
                            tipo_anticipo: filtros.tipo_anticipo,
                            fecha_solicitud_from: filtros.fechaDesde,
                            fecha_solicitud_to: filtros.fechaHasta
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

    const handleFiltroChange = (e) => {
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

    const handleViewFile = (documento) => {
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
        <Box sx={{ mt: 8 }}>  {/* Ajuste de margen superior */}
            <Container maxWidth="lg">
                {selectedColaborador && (
                    <Box mb={4} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body1"><strong>Nombre:</strong> {selectedColaborador.full_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body1"><strong>Email:</strong> {selectedColaborador.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body1"><strong>Compañía:</strong> {selectedColaborador.company_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>
                                <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={handleExportPDF}>
                                    Exportar PDF
                                </Button>
                                <Button variant="contained" color="success" onClick={handleExportExcel}>
                                    Exportar Excel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <InputLabel id="colaborador-label">Colaborador</InputLabel>
                            <Select
                                labelId="colaborador-label"
                                name="colaborador"
                                value={filtros.colaborador}
                                onChange={handleFiltroChange}
                                fullWidth
                            >
                                <MenuItem value=""><em>Buscar por colaborador</em></MenuItem>
                                {colaboradores.map(colaborador => (
                                    <MenuItem key={colaborador.id} value={colaborador.email}>
                                        {colaborador.full_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <InputLabel id="estado-label">Estado</InputLabel>
                            <Select
                                labelId="estado-label"
                                name="estado"
                                value={filtros.estado}
                                onChange={handleFiltroChange}
                                fullWidth
                            >
                                <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                                <MenuItem value="APROBADO">APROBADO</MenuItem>
                                <MenuItem value="RENDIDO">RENDIDO</MenuItem>
                                <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <InputLabel id="tipo_gasto-label">Tipo de Gasto</InputLabel>
                            <Select
                                labelId="tipo_gasto-label"
                                name="tipo_gasto"
                                value={filtros.tipo_gasto}
                                onChange={handleFiltroChange}
                                fullWidth
                            >
                                <MenuItem value=""><em>Seleccionar Tipo de Gasto</em></MenuItem>
                                <MenuItem value="MOVILIDAD">MOVILIDAD</MenuItem>
                                <MenuItem value="LOCAL">LOCAL</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <InputLabel id="tipo_anticipo-label">Tipo de Anticipo</InputLabel>
                            <Select
                                labelId="tipo_anticipo-label"
                                name="tipo_anticipo"
                                value={filtros.tipo_anticipo}
                                onChange={handleFiltroChange}
                                fullWidth
                            >
                                <MenuItem value=""><em>Seleccionar Tipo de Anticipo</em></MenuItem>
                                <MenuItem value="VIAJES">VIAJES</MenuItem>
                                <MenuItem value="LOCAL">LOCAL</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Fecha Desde"
                                type="date"
                                name="fechaDesde"
                                value={filtros.fechaDesde}
                                onChange={handleFiltroChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Fecha Hasta"
                                type="date"
                                name="fechaHasta"
                                value={filtros.fechaHasta}
                                onChange={handleFiltroChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </FormControl>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>RUC</TableCell>
                                <TableCell>Tipo Doc</TableCell>
                                <TableCell>Cuenta Contable</TableCell>
                                <TableCell>Serie</TableCell>
                                <TableCell>Correlativo</TableCell>
                                <TableCell>Rubro</TableCell>
                                <TableCell>Moneda</TableCell>
                                <TableCell>Tipo de Cambio</TableCell>
                                <TableCell>Afecto</TableCell>
                                <TableCell>IGV</TableCell>
                                <TableCell>Inafecto</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Archivo</TableCell>
                                <TableCell>Actualizar Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documentos.filter(doc => 
                                (!filtros.colaborador || (doc.usuario && doc.usuario.includes(filtros.colaborador))) &&
                                (!filtros.estado || (doc.estado && doc.estado.includes(filtros.estado)))
                            ).map((documento, index) => (
                                <TableRow key={documento.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{documento.fecha_emision}</TableCell>
                                    <TableCell>{documento.ruc}</TableCell>
                                    <TableCell>{documento.tipo_documento}</TableCell>
                                    <TableCell>{documento.cuenta_contable}</TableCell>
                                    <TableCell>{documento.serie}</TableCell>
                                    <TableCell>{documento.correlativo}</TableCell>
                                    <TableCell>{documento.rubro}</TableCell>
                                    <TableCell>{documento.moneda}</TableCell>
                                    <TableCell>{documento.tipo_cambio}</TableCell>
                                    <TableCell>{documento.afecto}</TableCell>
                                    <TableCell>{documento.igv}</TableCell>
                                    <TableCell>{documento.inafecto}</TableCell>
                                    <TableCell>{documento.total}</TableCell>
                                    <TableCell>
                                        {documento.archivo && (
                                            <Button variant="text" onClick={() => handleViewFile(documento)}>
                                                <img src={lupaIcon} alt="Ver Archivo" style={{ width: 24 }} />
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                value={documento.estado}
                                                onChange={(e) => handleEstadoChange(documento.id, e.target.value)}
                                            >
                                                <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                                                <MenuItem value="APROBADO">APROBADO</MenuItem>
                                                <MenuItem value="RENDIDO">RENDIDO</MenuItem>
                                                <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={showModal} onClose={handleCloseModal}>
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: '80%', 
                        bgcolor: 'background.paper', 
                        boxShadow: 24, 
                        p: 4 
                    }}>
                        <Typography variant="h6" component="h2">
                            Archivo del Documento
                        </Typography>
                        {selectedDocumento && selectedDocumento.archivo && (
                            <iframe
                                src={`http://127.0.0.1:8000/documentos/view/?file_location=${encodeURIComponent(selectedDocumento.archivo)}`}
                                width="100%"
                                height="600px"
                                title="Archivo del Documento"
                                frameBorder="0"
                            />
                        )}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button variant="contained" color="primary" onClick={() => handleDownloadFile(selectedDocumento.archivo)}>
                                Descargar Archivo
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
};

export default ContadorModule;
