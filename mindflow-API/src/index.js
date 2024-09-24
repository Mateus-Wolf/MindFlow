const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoute = require('./routes/usuarios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rotas
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.use('/api/usuarios', usuariosRoute);