const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db'); // Certifique-se de que o caminho para o seu db está correto

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

// Rota para registro de novos usuários
router.post('/register', async (req, res) => {
    const { nome, email, nascimento, senha, tipo_usuario } = req.body;

    try {
        // Verifica se o usuário já existe
        const usuarioExistente = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        // Hash da senha
        const hashedPassword = bcrypt.hashSync(senha, 8);

        // Cria um novo usuário
        const novoUsuario = await db.query(
            'INSERT INTO usuarios (nome, email, nascimento, senha, tipo_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, nascimento, hashedPassword, tipo_usuario]
        );

        res.status(201).json(novoUsuario.rows[0]);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
