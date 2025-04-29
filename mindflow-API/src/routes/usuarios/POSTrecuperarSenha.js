const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const { enviarEmail } = require('../../emailService');

// Rota para verificar o email e enviar o código de recuperação
router.post('/verificar-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email não fornecido' });
    }

    try {
        // Verifica se o email existe no banco de dados
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Email não encontrado' });
        }

        // Gera um código de recuperação e uma data de expiração
        const codigo = crypto.randomBytes(3).toString('hex'); 
        const expiracaoCodigo = new Date(Date.now() + 15 * 60 * 1000);

        // Armazena o código e a expiração no banco de dados
        await pool.query(
            'UPDATE usuarios SET codigo_recuperacao = $1, expiracao_codigo = $2 WHERE email = $3',
            [codigo, expiracaoCodigo, email]
        );

        // Envia o email com o código de recuperação
        enviarEmail(email, 'Código de Recuperação', `Seu código de recuperação é: ${codigo}`);

        res.status(200).json({ message: 'Código enviado para o e-mail.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao enviar o código.');
    }
});

// Rota para verificar o código inserido pelo usuário
router.post('/verificar-codigo', async (req, res) => {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
        return res.status(400).json({ message: 'Dados incompletos' });
    }

    try {
        // Verifica se o código e o email coincidem e se o código não expirou
        const resultado = await pool.query(
            'SELECT expiracao_codigo FROM usuarios WHERE email = $1 AND codigo_recuperacao = $2',
            [email, codigo]
        );

        if (resultado.rows.length === 0 || new Date() > resultado.rows[0].expiracao_codigo) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        res.status(200).json({ message: 'Código verificado com sucesso!' });
    } catch (error) {
        console.error(error.message || error);
        res.status(500).send('Erro ao verificar código.');
    }
});

// Rota para atualizar a senha após a verificação do código
router.post('/atualizar-senha', async (req, res) => {
    const { email, novaSenha, codigoRecuperacao } = req.body;

    console.log('Dados recebidos:', req.body);

    if (!novaSenha || !email || !codigoRecuperacao) {
        return res.status(400).json({ message: 'Dados incompletos' });
    }

    try {
        // Verifica se o email existe no banco de dados
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        console.log('Resultado da consulta de email:', resultado.rows);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Email não encontrado' });
        }

        const usuario = resultado.rows[0];

        if (usuario.codigo_recuperacao !== codigoRecuperacao) {
            return res.status(400).json({ message: 'Código de recuperação inválido' });
        }

        const agora = new Date();
        if (agora > new Date(usuario.expiracao_codigo)) {
            return res.status(400).json({ message: 'Código de recuperação expirado' });
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10);
        const updateResult = await pool.query(
            'UPDATE usuarios SET senha = $1, codigo_recuperacao = NULL, expiracao_codigo = NULL WHERE email = $2',
            [senhaHash, email]
        );

        if (updateResult.rowCount === 0) {
            return res.status(500).json({ message: 'Erro ao atualizar a senha' });
        }

        res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        res.status(500).send('Erro ao atualizar a senha.');
    }
});


module.exports = router;
