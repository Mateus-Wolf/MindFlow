const express = require('express');
const router = express.Router();
const pool = require('../../db');

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

    if (!id_paciente || !data_registro || humor_sono === undefined || humor_estresse === undefined || nivel_energia === undefined || humor_geral === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const insertQuery = `
            INSERT INTO registros_humor (id_paciente, data_registro, humor_sono, humor_estresse, nivel_energia, humor_geral, estudo, trabalho, exercicio, lazer)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, data_registro;
        `;
        const insertValues = [id_paciente, data_registro, humor_sono, humor_estresse, nivel_energia, humor_geral, estudo, trabalho, exercicio, lazer];
        const insertResult = await pool.query(insertQuery, insertValues);
        const registro = insertResult.rows[0];
        
        console.log('Registro de humor salvo com sucesso:', registro);

        const agendamentosQuery = `
            SELECT id, data FROM agendamentos 
            WHERE paciente_id = $1 AND DATE(data) = $2;
        `;
        const agendamentosResult = await pool.query(agendamentosQuery, [id_paciente, data_registro]);
        const agendamentos = agendamentosResult.rows;
        
        console.log(`Agendamentos encontrados para o paciente ${id_paciente} na data ${data_registro}:`, agendamentos);

        if (agendamentos.length > 0) {
            const updateStatusQuery = 'UPDATE agendamentos SET status_id = 2 WHERE id = $1'; // Alterado para 2
            for (const agendamento of agendamentos) {
                console.log(`Atualizando status do agendamento ID: ${agendamento.id}`);
                await pool.query(updateStatusQuery, [agendamento.id]);
            }
            console.log(`Status atualizado para ${agendamentos.length} agendamentos.`);
        } else {
            console.log('Nenhum agendamento encontrado para atualização de status.');
        }

        res.status(201).json({ 
            message: 'Avaliação salva com sucesso e status do(s) agendamento(s) atualizado(s)', 
            registro, 
            updatedAgendamentosCount: agendamentos.length 
        });
    } catch (error) {
        console.error('Erro ao salvar avaliação ou atualizar status do agendamento:', error);
        res.status(500).json({ error: 'Erro ao salvar a avaliação e atualizar o status do agendamento' });
    }
});

module.exports = router;
