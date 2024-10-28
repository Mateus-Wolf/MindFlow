const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.put('/novaSenha', async (req, res) => { // Verifique se aqui está 'mudar-senha'
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'seu_segredo');
        const userId = decoded.id;
        const { novaSenha } = req.body;

        // Hash da nova senha
        const hashedSenha = await bcrypt.hash(novaSenha, 10);

        // Atualizar a senha no banco de dados
        await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [hashedSenha, userId]);

        res.status(200).json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        res.status(500).json({ error: 'Erro ao atualizar a senha' });
    }
});

module.exports = router;
