const express = require('express');
const router = express.Router();
const pool = require('../../db');

router.get('/pacientes-recentes', async (req, res) => {
    console.log('Rota /pacientes-recentes acessada');
    const usuarioId = req.query.usuarioId;

    if (!usuarioId || isNaN(usuarioId)) {
        return res.status(400).json({ error: 'O ID do usuário é obrigatório e deve ser um número válido.' });
    }

    try {
        // Alteração para buscar agendamentos passados (data de hoje menos 1)
        const query = `
        SELECT DISTINCT ON (p.id) 
            p.id AS paciente_id,
            p.nome AS paciente_nome,
            p.genero,
            p.idade,
            a.data AS data_consulta,
            a.hora AS hora_consulta
        FROM agendamentos a
        INNER JOIN pacientes p ON a.paciente_id = p.id
        WHERE a.usuario_id = $1 AND a.data < CURRENT_DATE
        ORDER BY p.id, a.data DESC, a.hora DESC
        LIMIT 3;

        `;

        const { rows } = await pool.query(query, [usuarioId]);

        const pacientes = rows.map((row) => ({
            id: row.paciente_id,
            nome: row.paciente_nome,
            genero: row.genero,
            idade: row.idade,
            dataConsulta: row.data_consulta,
            horaConsulta: row.hora_consulta,
        }));


        res.json(pacientes);
    } catch (error) {
        console.error('Erro ao buscar pacientes recentes:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;
