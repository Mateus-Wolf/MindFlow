const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota para cadastrar pacientes
router.post('/', async (req, res) => {
    const { nome, idade, cpf, cep, genero, email, telefone, estadoCivil, id_medico } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pacientes (nome, idade, cpf, cep, genero, email, telefone, estadoCivil, id_medico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [nome, idade, cpf, cep, genero, email, telefone, estadoCivil, id_medico]
        );

        const novoPaciente = result.rows[0];
        res.status(201).json(novoPaciente); // Retorna o paciente cadastrado
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        res.status(500).json({ error: 'Erro ao cadastrar paciente' });
    }
});

module.exports = router;
