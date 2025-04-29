const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota para cadastrar pacientes
router.post('/', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    let usuarioId;
    try {
        const decoded = jwt.verify(token, 'seu_segredo');
        usuarioId = decoded.id; 
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const usuarioExistente = await Usuario.findByPk(usuarioId);
    if (!usuarioExistente) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
    }
    
    const { nome, idade, cpf, cep, genero, email, telefone, estadoCivil, id_medico } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pacientes (usuario_id, nome, idade, cpf, cep, genero, email, telefone, estadoCivil, id_medico) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [usuarioId, nome, idade, cpf, cep, genero, email, telefone, estadoCivil, id_medico]
        );

        const novoPaciente = result.rows[0];
        res.status(201).json(novoPaciente);
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        res.status(500).json({ error: 'Erro ao cadastrar paciente' });
    }
});


module.exports = router;
