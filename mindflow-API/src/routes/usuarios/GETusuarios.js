const express = require('express');
const db = require('../../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Rota para obter todos os usuários sem a imagem
router.get('/', async (req, res) => {
    try {
        // Consulta todos os usuários no banco de dados, excluindo a coluna de imagem
        const usuarios = await db.query('SELECT id, nome, email, nascimento, tipo_usuario, registro_profissional, experiencia_anos, estado_atuacao, telefone, idiomas FROM usuarios');
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
        const decoded = jwt.verify(token, 'seu_segredo');
        const usuario = await db.query(`
  SELECT id, nome, email, nascimento, imagem, registro_profissional, experiencia_anos, estado_atuacao, telefone, idiomas
  FROM usuarios 
  WHERE id = $1
`, [decoded.id]);

        if (usuario.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userData = usuario.rows[0];

        // Converte a imagem para base64 se ela existir
        if (userData.imagem) {
            userData.imagem = `data:image/png;base64,${userData.imagem.toString('base64')}`;
        }

        res.json(userData); // Retorna os dados do usuário com a imagem em base64
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({ error: 'Erro ao verificar token: ' + error.message });
    }
});

// Rota para verificar se um e-mail já está em uso
router.get('/email/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const emailCheck = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);

        if (emailCheck.rows.length > 0) {
            return res.status(200).json({ exists: true });
        }

        res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Erro ao verificar e-mail:', error);
        res.status(500).json({ error: 'Erro ao verificar e-mail' });
    }
});


module.exports = router;
