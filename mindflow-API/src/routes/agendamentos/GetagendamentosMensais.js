const express = require('express');
const router = express.Router();
const db = require('../../db');

// Rota para buscar agendamentos mensais
router.get('/mensal', async (req, res) => {
    const { mes } = req.query;
    if (!mes) {
        return res.status(400).json({ error: 'Mês não fornecido' });
    }
    try {
        const [ano, mesNum] = mes.split('-');
        const agendamentos = await db.query(
            'SELECT * FROM agendamentos WHERE EXTRACT(YEAR FROM data) = $1 AND EXTRACT(MONTH FROM data) = $2',
            [ano, mesNum]
        );
        res.json(agendamentos.rows);
    } catch (error) {
        console.error('Erro ao buscar agendamentos mensais:', error);
        res.status(500).send('Erro ao buscar agendamentos mensais');
    }
});

module.exports = router;
