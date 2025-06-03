const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    const {
        nome,
        email,
        nascimento,
        senha,
        tipo_usuario,
        registro_profissional,
        experiencia_anos,
        estado_atuacao,
        telefone,
        idiomas // espera-se um array, ex: ["português", "inglês"]
    } = req.body;

    try {
        const usuarioExistente = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const hashedPassword = bcrypt.hashSync(senha, 8);

        const novoUsuario = await db.query(
            `INSERT INTO usuarios (
                nome, email, nascimento, senha, tipo_usuario,
                registro_profissional, experiencia_anos, estado_atuacao,
                telefone, idiomas
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, nome, email`,
            [
                nome,
                email,
                nascimento,
                hashedPassword,
                tipo_usuario,
                registro_profissional,
                experiencia_anos,
                estado_atuacao,
                telefone,
                idiomas
            ]
        );

        const token = jwt.sign({ id: novoUsuario.rows[0].id }, 'seu_segredo', { expiresIn: '1h' });

        res.status(201).json({
            usuario: novoUsuario.rows[0],
            token
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
