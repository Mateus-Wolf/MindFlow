const express = require('express');
const router = express.Router();
const db = require('../../db');

// Rota para atualizar os dados de um paciente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, cpf, cep, genero, email, telefone, estado_civil } = req.body;

    try {
        const result = await db.query(
            'UPDATE pacientes SET nome = $1, idade = $2, cpf = $3, cep = $4, genero = $5, email = $6, telefone = $7, estado_civil = $8 WHERE id = $9 RETURNING *',
            [nome, idade, cpf, cep, genero, email, telefone, estado_civil, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
        res.status(500).json({ message: 'Erro ao atualizar paciente' });
    }
});

module.exports = router;
