const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota para obter todos os pacientes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pacientes');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter pacientes:', error);
        res.status(500).json({ error: 'Erro ao obter pacientes' });
    }
});

// Rota para obter um paciente específico pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Verifica se o ID é um número
    const pacienteId = parseInt(id, 10);

    if (isNaN(pacienteId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [pacienteId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Paciente não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter paciente:', error);
        res.status(500).json({ error: 'Erro ao obter paciente' });
    }
});

// Rota para criar um novo paciente
router.post('/', async (req, res) => {
    const { usuario_ID, nome, idade, cpf, cep, genero, email, telefone, estado_civil } = req.body;

    // Validação básica para garantir que os campos não estejam vazios
    if (!usuario_ID || !nome || !idade || !cpf || !cep || !genero || !email || !telefone || !estado_civil) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO pacientes (usuario_ID, nome, idade, cpf, cep, genero, email, telefone, estado_civil) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [usuario_ID, nome, idade, cpf, cep, genero, email, telefone, estado_civil]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar paciente:', error);
        res.status(500).json({ error: 'Erro ao criar paciente', details: error.message });
    }
});

module.exports = router;