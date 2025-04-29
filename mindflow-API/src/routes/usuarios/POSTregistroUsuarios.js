const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Rota para registro de novos usuários
router.post('/register', async (req, res) => {
    const { nome, email, nascimento, senha, tipo_usuario } = req.body;

    try {
        // Verifica se o usuário já existe
        console.log('Consultando banco de dados para email:', email);
        const usuarioExistente = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        console.log('Resultado da consulta:', usuarioExistente.rows);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }
        

        // Hash da senha
        const hashedPassword = bcrypt.hashSync(senha, 8);

        // Cria um novo usuário
        console.log('Inserindo usuário no banco...');
        const novoUsuario = await db.query(
            'INSERT INTO usuarios (nome, email, nascimento, senha, tipo_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, nascimento, hashedPassword, tipo_usuario]
        );
        console.log('Usuário inserido:', novoUsuario.rows[0]);

        // Gera um token
        const token = jwt.sign({ id: novoUsuario.rows[0].id }, 'seu_segredo', { expiresIn: '1h' });

        // Responde com status 201 e os dados do usuário (incluindo o nome) e o token
        res.status(201).json({ usuario: { id: novoUsuario.rows[0].id, nome: novoUsuario.rows[0].nome, email: novoUsuario.rows[0].email }, token });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
