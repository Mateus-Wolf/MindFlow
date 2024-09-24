import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // URL base da sua API

// Função para obter usuários
export const getUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/usuarios`);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        throw error;
    }
};

// Adicione outras funções para interagir com a API, como criar, atualizar e deletar usuários
