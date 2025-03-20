const express = require('express');
const router = express.Router();
const db = require('../../db');

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            'DELETE FROM pacientes WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        res.status(200).json({ message: 'Paciente excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        res.status(500).json({ message: 'Erro ao excluir paciente' });
    }
});

module.exports = router;