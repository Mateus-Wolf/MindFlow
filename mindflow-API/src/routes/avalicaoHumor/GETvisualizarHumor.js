// Importações necessárias
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Rota para obter um registro de humor específico de um paciente
router.get('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    const registroId = parseInt(id, 10);
    if (isNaN(registroId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM registros_humor WHERE id = $1',
            [registroId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Registro não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter registro de humor:', error);
        res.status(500).json({ error: 'Erro ao obter registro de humor' });
    }
});

// Rota para obter uma avaliação de humor específica de um paciente
router.get('/avaliacaoHumor/:id', async (req, res) => {
    const { id } = req.params;
    const registroId = parseInt(id, 10);

    if (isNaN(registroId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM registros_humor WHERE id = $1',
            [registroId]
        );

        if (result.rows.length > 0) {
            const registro = result.rows[0];
            res.json({
                id: registro.id,
                humor: registro.humor,
                observacao: registro.observacao // Aqui já pegamos a observação diretamente
            });
        } else {
            res.status(404).json({ error: 'Avaliação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao obter avaliação de humor:', error);
        res.status(500).json({ error: 'Erro ao obter avaliação de humor' });
    }
});

module.exports = router;
