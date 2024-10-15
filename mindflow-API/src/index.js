const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoute = require('./routes/usuarios');
const loginRouter = require('./routes/login');
const pacientesRouter = require('./routes/pacientes');
const PUTagendamentosRoute = require('./routes/PUTagendamentos');
const GETagendamentosRoute = require('./routes/GETagendamentos');

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
app.use('/api/agendamentos', GETagendamentosRoute); // Ajuste aqui
app.use(PUTagendamentosRoute);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
