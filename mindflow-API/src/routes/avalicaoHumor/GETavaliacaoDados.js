const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota para obter os registros de humor de um paciente específico
router.get('/:id/agendamentos', async (req, res) => {
    const { id } = req.params;
    const pacienteId = parseInt(id, 10);

    if (isNaN(pacienteId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        // Consulta para buscar os registros de humor associados ao paciente
        const result = await pool.query(
            'SELECT * FROM registros_humor WHERE id_paciente = $1 ORDER BY data_registro DESC',
            [pacienteId]
        );

        if (result.rows.length > 0) {
            res.json({ nome: 'Nome do paciente', agendamentos: result.rows });
        } else {
            res.status(404).json({ error: 'Nenhum registro encontrado para este paciente' });
        }
    } catch (error) {
        console.error('Erro ao obter registros de humor:', error);
        res.status(500).json({ error: 'Erro ao obter registros de humor' });
    }
});

module.exports = router;