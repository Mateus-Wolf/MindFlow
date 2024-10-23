const express = require('express');
const router = express.Router();
const db = require('../../db');

// Rota para buscar agendamentos por data com dados do paciente
router.get('/', async (req, res) => {
    const { data, usuario_id } = req.query; // Data e usuario_id enviados como query
    try {
        const agendamentos = await db.query(`
            SELECT a.*, p.nome 
            FROM agendamentos a 
            JOIN pacientes p ON a.paciente_id = p.id 
            WHERE a.data = $1 AND a.usuario_id = $2`, [data, usuario_id]);
        res.json(agendamentos.rows);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).send('Erro ao buscar agendamentos');
    }
});


module.exports = router;
