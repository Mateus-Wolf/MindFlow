// POSTrecuperarSenha.js

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const { enviarEmail } = require('../../emailService'); 

// Rota de recuperação de senha
router.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  const codigo = crypto.randomBytes(3).toString('hex');  // Gera um código aleatório
  const expiracao = new Date(Date.now() + 3600000);  // Expira em 1 hora

  try {
    // Atualiza o código e a data de expiração no banco de dados
    await pool.query(
      'UPDATE usuarios SET codigo_recuperacao = $1, expiracao_codigo = $2 WHERE email = $3',
      [codigo, expiracao, email]
    );

    // Envia o e-mail com o código de recuperação
    await enviarEmail(email, 'Recuperação de Senha', `Seu código de recuperação é: ${codigo}`);

    // Responde ao cliente
    res.status(200).send('Código de recuperação enviado para seu e-mail.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao solicitar recuperação de senha.');
  }
});

// Rota para verificar o código e redefinir a senha
router.post('/verificar-codigo', async (req, res) => {
  const { email, codigo, novaSenha } = req.body;

  try {
    const resultado = await pool.query(
      'SELECT expiracao_codigo FROM usuarios WHERE email = $1 AND codigo_recuperacao = $2',
      [email, codigo]
    );

    if (resultado.rows.length === 0 || new Date() > resultado.rows[0].expiracao_codigo) {
      return res.status(400).send('Código inválido ou expirado.');
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    
    // Atualiza a senha no banco de dados
    await pool.query(
      'UPDATE usuarios SET senha = $1, codigo_recuperacao = NULL, expiracao_codigo = NULL WHERE email = $2',
      [senhaHash, email]
    );

    res.status(200).send('Senha redefinida com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao redefinir a senha.');
  }
});

module.exports = router;
