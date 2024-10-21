const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota de login
router.post('/', async (req, res) => {
    const { email, senha } = req.body;

    console.log('Email:', email);
    console.log('Senha:', senha);

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = result.rows[0];

        console.log('Usuário encontrado:', usuario);

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        console.log('Senha fornecida:', senha);
        console.log('Senha armazenada:', usuario.senha);
        console.log('Senha válida:', senhaValida);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const token = jwt.sign({ id: usuario.id, tipo_usuario: usuario.tipo_usuario }, 'seu_segredo', {
            expiresIn: '1h',
        });
        console.log('Token gerado:', token); // Log do token gerado

        res.json({ token, nome: usuario.nome });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});


module.exports = router;
