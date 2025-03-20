const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota para obter os registros de humor de um paciente específico
router.get('/:id/registros', async (req, res) => {
    const { id } = req.params;

    // Verifica se o ID é um número
    const pacienteId = parseInt(id, 10);
    if (isNaN(pacienteId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await pool.query(`
            SELECT id, paciente_id, TO_CHAR(data, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS data_registro
            FROM registros_humor
            WHERE paciente_id = $1
        `, [pacienteId]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter registros de humor:', error);
        res.status(500).json({ error: 'Erro ao obter registros de humor' });
    }
});


module.exports = router;
