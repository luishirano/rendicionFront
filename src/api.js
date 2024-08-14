import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    //baseURL: 'https://xfcnt62w-8000.brs.devtunnels.ms/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Función para obtener usuarios por company_name y role
export const getUsersByCompanyAndRole = async (companyName, role) => {
    const response = await api.get(`/users/by-company-and-role/`, {
        params: {
            company_name: companyName,
            role: role,
        },
    });
    return response.data;
};

export default api;
