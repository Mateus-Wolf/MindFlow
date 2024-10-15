const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para buscar agendamentos por data
router.get('/', async (req, res) => {
    const { data } = req.query; // Data enviada como query
    try {
        const agendamentos = await db.query('SELECT * FROM agendamentos WHERE data = $1', [data]);
        res.json(agendamentos.rows);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).send('Erro ao buscar agendamentos');
    }
});

module.exports = router;
