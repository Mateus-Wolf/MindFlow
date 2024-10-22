const express = require('express');
const db = require('../../db'); // Certifique-se de que o caminho para o seu db está correto
const jwt = require('jsonwebtoken');

const router = express.Router();

// Rota para obter todos os usuários
router.get('/', async (req, res) => {
    try {
        // Consulta todos os usuários no banco de dados
        const usuarios = await db.query('SELECT * FROM usuarios');
        res.status(200).json(usuarios.rows);
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).json({ error: 'Erro ao obter usuários' });
    }
});

// Rota para obter dados do usuário logado
router.get('/me', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, 'seu_segredo'); // Verifique se o segredo está correto
        const usuario = await db.query('SELECT * FROM usuarios WHERE id = $1', [decoded.id]);        

        if (usuario.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(usuario.rows[0]); // Retorna os dados do usuário
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({ error: 'Erro ao verificar token: ' + error.message });
    }
});

module.exports = router;
