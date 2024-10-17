const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoute = require('./routes/usuarios');
const loginRouter = require('./routes/login');
const pacientesRouter = require('./routes/pacientes');
const PUTagendamentosRoute = require('./routes/PUTagendamentos');
const GETagendamentosRoute = require('./routes/GETagendamentos');
const PUTpacientes = require('./routes/PUTpacientes')
const DELETEpacientes = require('./routes/DELETEpaciente')

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
app.use('/api/agendamentos', GETagendamentosRoute);
app.use(PUTagendamentosRoute);
app.use('/api/pacientes', PUTpacientes);
app.use('/api/pacientes', DELETEpacientes)

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
