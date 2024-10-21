const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.put('/me/senha', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        // Verificando o token e extraindo o ID do usuário
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'seu_segredo');
        const userId = decoded.id;

        // Pegando a nova senha da requisição
        const { novaSenha } = req.body;

        // Criptografar a nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(novaSenha, salt);

        // Atualizando a senha no banco de dados
        const query = `
            UPDATE usuarios 
            SET senha = $1
            WHERE id = $2
            RETURNING *;
        `;
        const values = [hashedPassword, userId];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).json({ error: 'Erro ao atualizar senha' });
    }
});


module.exports = router;
