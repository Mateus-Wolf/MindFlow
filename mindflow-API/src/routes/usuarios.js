const express = require('express');
const pool = require('../db');
const router = express.Router();

// Obter todos os usuários
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao obter usuários' });
    }
});

// Adicionar outros endpoints conforme necessário

module.exports = router;
