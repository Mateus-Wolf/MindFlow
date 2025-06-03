const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.put('/me', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'seu_segredo');
        const userId = decoded.id;

        const {
            nome,
            email,
            nascimento,
            senha,
            registro_profissional,
            experiencia_anos,
            estado_atuacao,
            telefone,
            idiomas
        } = req.body;

        let hashedPassword = null;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(senha, salt);
        }

        // Monta dinamicamente os campos a atualizar e seus valores
        const fields = [
            { name: 'nome', value: nome },
            { name: 'email', value: email },
            { name: 'nascimento', value: nascimento },
            { name: 'registro_profissional', value: registro_profissional },
            { name: 'experiencia_anos', value: experiencia_anos },
            { name: 'estado_atuacao', value: estado_atuacao },
            { name: 'telefone', value: telefone },
            { name: 'idiomas', value: idiomas }
        ];

        if (hashedPassword) {
            fields.push({ name: 'senha', value: hashedPassword });
        }

        // Remove os campos com valor undefined (não enviados)
        const filteredFields = fields.filter(field => field.value !== undefined);

        // Monta a query SET dinamicamente e o array de valores
        const setString = filteredFields
            .map((field, index) => `${field.name} = $${index + 1}`)
            .join(', ');

        const values = filteredFields.map(field => field.value);
        const userIdIndex = values.length + 1; // índice para o WHERE
        values.push(userId);

        const query = `
            UPDATE usuarios
            SET ${setString}
            WHERE id = $${userIdIndex}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        console.log('Dados atualizados:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

module.exports = router;
