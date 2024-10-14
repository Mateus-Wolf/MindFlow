const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoute = require('./routes/usuarios');
const loginRouter = require('./routes/login');
const pacientesRouter = require('./routes/pacientes');
const agendamentosRoute = require('./routes/agendamentos');

// Configurar o dotenv
dotenv.config();

// Inicializar o aplicativo Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Definindo as rotas
app.use('/api/usuarios', usuariosRoute);
app.use('/api/login', loginRouter);
app.use('/api/pacientes', pacientesRouter);
app.use(agendamentosRoute);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    //console.log('ROTA DE PACIENTES = http://localhost:3000/api/pacientes');
    //console.log('ROTA DE USUARIOS = http://localhost:3000/api/usuarios');
});
