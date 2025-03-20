const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../../db');

const upload = multer(); 

const atualizarImagemUsuario = async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const imagem = req.file.buffer;

    try {
        const result = await db.query('UPDATE usuarios SET imagem = $1 WHERE id = $2', [imagem, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ message: 'Imagem atualizada com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        return res.status(500).json({ error: 'Erro ao atualizar imagem: ' + error.message });
    }
};

// Nova função para obter a imagem do usuário
const obterImagemUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT imagem FROM usuarios WHERE id = $1', [id]);

        if (result.rows.length === 0 || !result.rows[0].imagem) {
            return res.status(404).json({ error: 'Imagem não encontrada.' });
        }

        // Define o cabeçalho para conteúdo de imagem e envia o buffer da imagem
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(result.rows[0].imagem);
    } catch (error) {
        console.error('Erro ao obter imagem:', error);
        return res.status(500).json({ error: 'Erro ao obter imagem.' });
    }
};

// Rota para atualizar a imagem
router.put('/:id/imagem', upload.single('imagem'), atualizarImagemUsuario);

// Nova rota para obter a imagem
router.get('/:id/imagem', obterImagemUsuario);

module.exports = router;
