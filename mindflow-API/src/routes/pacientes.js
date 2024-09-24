const express = require('express');
const router = express.Router();
const pool = require('../db');

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

// Rota para criar um novo paciente
router.post('/', async (req, res) => {
    const { medico_id, nome, idade, cpf, cep, genero, email, telefone, estado_civil } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO pacientes (medico_id, nome, idade, cpf, cep, genero, email, telefone, estado_civil) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [medico_id, nome, idade, cpf, cep, genero, email, telefone, estado_civil]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar paciente:', error);
        res.status(500).json({ error: 'Erro ao criar paciente' });
    }
});

module.exports = router;
