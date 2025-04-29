const API_URL = 'http://mindflow-api:3000/api';

export const criarConta = async (dados) => {
  const response = await fetch(`${API_URL}/usuarios/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return response.json();
};

// Outros endpoints podem ser adicionados da mesma forma
