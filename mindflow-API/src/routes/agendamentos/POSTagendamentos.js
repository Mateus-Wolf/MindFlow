const express = require('express');
const router = express.Router();
const db = require('../../db');

// Rota para criar agendamentos
router.post('/', (req, res) => {
    const { paciente_id, usuario_id, data, hora, descricao, registro_humor_id } = req.body;

    // Validação dos dados recebidos
    if (!paciente_id || !usuario_id || !data || !hora || !descricao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Criação da query para inserir o agendamento no banco de dados
    const query = `
        INSERT INTO agendamentos (paciente_id, usuario_id, data, hora, descricao, registro_humor_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;

    const values = [paciente_id, usuario_id, data, hora, descricao, registro_humor_id];

    db.query(query, values)
        .then(result => {
            res.status(201).json({ id: result.rows[0].id });
        })
        .catch(error => {
            console.error('Erro ao criar agendamento:', error);
            res.status(500).json({ error: 'Erro ao criar agendamento' });
        });
});

module.exports = router;
