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
        // Verificando o token e extraindo o ID do usuário
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'seu_segredo');
        const userId = decoded.id;

        // Pegando os dados da requisição
        const { nome, email, nascimento, senha } = req.body;

        // Criptografar nova senha se ela foi fornecida
        let hashedPassword = null;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(senha, salt);
        }

        // Atualizando o usuário no banco de dados
        const query = `
        UPDATE usuarios 
        SET nome = $1, email = $2, nascimento = $3
        WHERE id = $4
        RETURNING *;
    `;
        const values = [nome, email, nascimento, userId];

        const result = await pool.query(query, values);

        // Log para verificar a nova senha hashada
        console.log('Senha armazenada após atualização:', result.rows[0].senha);
        console.log('Dados atualizados:', result.rows[0]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(result.rows[0]); 
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

module.exports = router;
