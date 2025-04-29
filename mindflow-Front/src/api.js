import axios from 'axios';

const API_URL = 'http://mindflow-api:3000/api';


export const getUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        throw error;
    }
};

