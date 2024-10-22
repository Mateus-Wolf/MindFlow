// Importar as dependências necessárias
const express = require('express');
const router = express.Router();
const pool = require('../../db'); // Ajuste o caminho conforme necessário

// Rota para salvar a avaliação
router.post('/registro-avaliacao', async (req, res) => {
    console.log('Dados recebidos no backend:', req.body); 
    const {
        id_paciente,
        data_registro,
        humor_sono,
        humor_estresse,
        nivel_energia,
        humor_geral,
        estudo,
        trabalho,
        exercicio,
        lazer
    } = req.body;

    // Validação simples
    if (!id_paciente || !data_registro || humor_sono === undefined || humor_estresse === undefined || nivel_energia === undefined || humor_geral === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        console.log('Dados recebidos no back-end:', req.body);
        const query = `
            INSERT INTO registros_humor (id_paciente, data_registro, humor_sono, humor_estresse, nivel_energia, humor_geral, estudo, trabalho, exercicio, lazer)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;

        const values = [id_paciente, data_registro, humor_sono, humor_estresse, nivel_energia, humor_geral, estudo, trabalho, exercicio, lazer];

        console.log('Valores para inserção:', values);
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        res.status(500).json({ error: 'Erro ao salvar a avaliação' });
    }
});

// Exportar o router
module.exports = router;
