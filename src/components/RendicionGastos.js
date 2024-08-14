import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RendicionGastos.css';

const RendicionGastos = () => {
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = () => {
        if (category) {
            // Extraer el valor y el texto de la opción seleccionada
            const selectedOption = document.getElementById("category").selectedOptions[0];
            const selectedCuentaContable = selectedOption.value;
            const selectedRubro = selectedOption.text;

            navigate('/datos-recibo', {
                state: { selectedCuentaContable, selectedRubro }
            });
        } else {
            alert('Por favor, seleccione una categoría antes de enviar');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                    <h1 className="card-title text-center mb-4">Rendición de Gastos</h1>
                    <div className="form-group">
                        <label htmlFor="category" className="form-label">Categoría</label>
                        <select id="category" className="form-control" value={category} onChange={handleCategoryChange}>
                            <option value="" disabled>Seleccione una categoría</option>
                            <option value="63111">Servicio transporte De carga</option>
                            <option value="63112">Servicio transporte  De pasajeros</option>
                            <option value="6312">Correos</option>
                            <option value="6313">Alojamiento</option>
                            <option value="6314">Alimentación</option>
                            <option value="6315">Otros gastos de viaje</option>
                            <option value="6321">Asesoria - Administrativa</option>
                            <option value="6322">Asesoria - Legal y tributaria</option>
                            <option value="6323">Asesoria - Auditoría y contable</option>
                            <option value="6324">Asesoria - Mercadotecnia</option>
                            <option value="6325">Asesoria - Medioambiental</option>
                            <option value="6326">Asesoria - Investigación y desarrollo</option>
                            <option value="6327">Asesoria - Producción</option>
                            <option value="6329">Asesoria - Otros</option>
                            <option value="6343">Mantto y Reparacion - Inmuebles, maquinaria y equipo</option>
                            <option value="6344">Mantto y Reparacion - Intangibles</option>
                            <option value="6351">Alquileres - Terrenos</option>
                            <option value="6352">Alquileres - Edificaciones</option>
                            <option value="6353">Alquileres - Maquinarias y equipos de explotación</option>
                            <option value="6354">Alquileres - Equipo de transporte</option>
                            <option value="6356">Alquileres - Equipos diversos</option>
                            <option value="6361">Energía eléctrica</option>
                            <option value="6362">Gas</option>
                            <option value="6363">Agua</option>
                            <option value="6364">Teléfono</option>
                            <option value="6365">Internet</option>
                            <option value="6366">Radio</option>
                            <option value="6367">Cable</option>
                            <option value="6371">Publicidad</option>
                            <option value="6372">Publicaciones</option>
                            <option value="6373">Servicio de Relaciones públicas</option>
                            <option value="6391">Gastos bancarios</option>
                            <option value="6431">Impuesto predial</option>
                            <option value="6432">Arbitrios municipales y seguridad ciudadana</option>
                            <option value="6433">Impuesto al patrimonio vehicular</option>
                            <option value="6434">Licencia de funcionamiento</option>
                            <option value="6439">Otros</option>
                            <option value="653">Suscripciones</option>
                            <option value="654">Licencias y derechos de vigencia</option>
                            <option value="656">Suministros</option>
                            <option value="659">Otros gastos de gestión</option>
                            <option value="6591">Donaciones</option>
                            <option value="6592">Sanciones administrativas</option>
                            {/* Agregar más opciones según sea necesario */}
                        </select>
                    </div>
                    <button className="btn btn-primary btn-block mt-4" onClick={handleSubmit}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RendicionGastos;
