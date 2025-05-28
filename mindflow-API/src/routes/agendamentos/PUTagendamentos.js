const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota PUT para marcar um agendamento como Cancelado
router.put('/:id/cancelar', async (req, res) => {
    const { id } = req.params;

    try {
        // Atualizar o status para 3 (Consulta Cancelada)
        await pool.query(
            'UPDATE agendamentos SET status_id = $1 WHERE id = $2',
            [3, id]
        );
        res.status(200).json({ message: 'Agendamento cancelado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        res.status(500).json({ error: 'Erro ao cancelar o agendamento.' });
    }
});

// Rota PUT para marcar um agendamento como Concluído
router.put('/:id/concluir', async (req, res) => {
    const { id } = req.params;
    console.log(`Tentando concluir agendamento com ID: ${id}`); // Adicionando log para depuração

    try {
        // Atualiza o status do agendamento para concluído (ID 2)
        const result = await pool.query('UPDATE agendamentos SET status_id = $1 WHERE id = $2', [2, id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }

        res.status(200).send({ message: 'Agendamento concluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao concluir agendamento:', error);
        res.status(500).send({ error: 'Erro ao concluir agendamento' });
    }
});

// Rota PUT para marcar um agendamento como Perdido
// Rota PUT para marcar um agendamento como Perdido
router.put('/status', async (req, res) => {
    try {
        // Gera "agora" no fuso horário de São Paulo (UTC-3)
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

        const query = `
            UPDATE agendamentos
            SET status_id = 4
            WHERE status_id = 1 
            AND (data::timestamp + hora::time) < $1
            RETURNING *;
        `;

        const result = await pool.query(query, [now]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: 'Status do(s) agendamento(s) atualizado(s) com sucesso!',
                agendamento: result.rows
            });
        } else {
            res.status(404).json({ message: 'Nenhum agendamento encontrado para atualizar.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar o status do agendamento:', error);
        res.status(500).json({ message: 'Erro ao atualizar o status do agendamento.' });
    }
});

module.exports = router;
