const express = require('express');
const router = express.Router();
const pool = require('../../db'); // Certifique-se de importar a conexão com o banco de dados

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

    try {
        // Atualiza o status do agendamento para concluído (ID 2)
        await pool.query('UPDATE agendamentos SET status_id = $1 WHERE id = $2', [2, id]);
        res.status(200).send({ message: 'Agendamento concluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao concluir agendamento:', error);
        res.status(500).send({ error: 'Erro ao concluir agendamento' });
    }
});

// Rota PUT para marcar um agendamento como Perdido
router.put('/status', async (req, res) => {
    try {
        // Obter a data e hora atuais
        const now = new Date();
        
        // Query para atualizar o status
        const query = `
            UPDATE agendamentos
            SET status_id = 4
            WHERE status_id = 1 AND TO_TIMESTAMP(data || ' ' || hora, 'YYYY-MM-DD HH24:MI:SS') < $1
            RETURNING *;
        `;

        const result = await pool.query(query, [now]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: 'Status do agendamento atualizado com sucesso!',
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
