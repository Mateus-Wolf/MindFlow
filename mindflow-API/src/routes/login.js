const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota de login
router.post('/', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        // Gera o token
        const token = jwt.sign({ id: usuario.id, tipo_usuario: usuario.tipo_usuario }, 'seu_segredo', {
            expiresIn: '1h',
        });

        // Retorna o token, o nome do usuário e o ID
        res.json({ token, nome: usuario.nome, id: usuario.id }); // Adicione o id aqui
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// Certifique-se de exportar o router corretamente
module.exports = router;
