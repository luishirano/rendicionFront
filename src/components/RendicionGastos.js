import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const RendicionGastos = () => {
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = () => {
        if (category) {
            // Si la categoría seleccionada es "Servicio transporte De pasajeros", redirigir a la página de Movilidad
            if (category === "63112") {
                navigate('/colaborador/movilidad'); // Redirige a la ruta del componente Movilidad
            } else {
                // Para otras categorías, redirigir a DatosRecibo u otra ruta
                navigate('/datos-recibo', {
                    state: { selectedCategory: category }
                });
            }
        } else {
            alert('Por favor, seleccione una categoría antes de enviar');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Rendición de Gastos
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="category-label">Categoría</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            onChange={handleCategoryChange}
                            label="Categoría"
                        >
                            <MenuItem value="" disabled>Seleccione una categoría</MenuItem>
                            <MenuItem value="63111">Servicio transporte De carga</MenuItem>
                            <MenuItem value="63112">Servicio transporte De pasajeros</MenuItem>
                            <MenuItem value="6312">Correos</MenuItem>
                            <MenuItem value="6313">Alojamiento</MenuItem>
                            <MenuItem value="6314">Alimentación</MenuItem>
                            <MenuItem value="6315">Otros gastos de viaje</MenuItem>
                            <MenuItem value="6321">Asesoria - Administrativa</MenuItem>
                            <MenuItem value="6322">Asesoria - Legal y tributaria</MenuItem>
                            <MenuItem value="6323">Asesoria - Auditoría y contable</MenuItem>
                            <MenuItem value="6324">Asesoria - Mercadotecnia</MenuItem>
                            <MenuItem value="6325">Asesoria - Medioambiental</MenuItem>
                            <MenuItem value="6326">Asesoria - Investigación y desarrollo</MenuItem>
                            <MenuItem value="6327">Asesoria - Producción</MenuItem>
                            <MenuItem value="6329">Asesoria - Otros</MenuItem>
                            <MenuItem value="6343">Mantto y Reparacion - Inmuebles, maquinaria y equipo</MenuItem>
                            <MenuItem value="6344">Mantto y Reparacion - Intangibles</MenuItem>
                            <MenuItem value="6351">Alquileres - Terrenos</MenuItem>
                            <MenuItem value="6352">Alquileres - Edificaciones</MenuItem>
                            <MenuItem value="6353">Alquileres - Maquinarias y equipos de explotación</MenuItem>
                            <MenuItem value="6354">Alquileres - Equipo de transporte</MenuItem>
                            <MenuItem value="6356">Alquileres - Equipos diversos</MenuItem>
                            <MenuItem value="6361">Energía eléctrica</MenuItem>
                            <MenuItem value="6362">Gas</MenuItem>
                            <MenuItem value="6363">Agua</MenuItem>
                            <MenuItem value="6364">Teléfono</MenuItem>
                            <MenuItem value="6365">Internet</MenuItem>
                            <MenuItem value="6366">Radio</MenuItem>
                            <MenuItem value="6367">Cable</MenuItem>
                            <MenuItem value="6371">Publicidad</MenuItem>
                            <MenuItem value="6372">Publicaciones</MenuItem>
                            <MenuItem value="6373">Servicio de Relaciones públicas</MenuItem>
                            <MenuItem value="6391">Gastos bancarios</MenuItem>
                            <MenuItem value="6431">Impuesto predial</MenuItem>
                            <MenuItem value="6432">Arbitrios municipales y seguridad ciudadana</MenuItem>
                            <MenuItem value="6433">Impuesto al patrimonio vehicular</MenuItem>
                            <MenuItem value="6434">Licencia de funcionamiento</MenuItem>
                            <MenuItem value="6439">Otros</MenuItem>
                            <MenuItem value="653">Suscripciones</MenuItem>
                            <MenuItem value="654">Licencias y derechos de vigencia</MenuItem>
                            <MenuItem value="656">Suministros</MenuItem>
                            <MenuItem value="659">Otros gastos de gestión</MenuItem>
                            <MenuItem value="6591">Donaciones</MenuItem>
                            <MenuItem value="6592">Sanciones administrativas</MenuItem>
                            {/* Agregar más opciones según sea necesario */}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
                        Siguiente
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RendicionGastos;
