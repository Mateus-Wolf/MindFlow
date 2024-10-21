const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoute = require('./routes/usuarios/GETusuarios');
const loginRouter = require('./routes/usuarios/POSTusuario');
const pacientesRouter = require('./routes/pacientes/GETpacientes');
const PUTusuarios = require('./routes/usuarios/PUTusuarios')
const PUTsenha = require('./routes/usuarios/PUTsenha');
const PUTagendamentosRoute = require('./routes/agendamentos/POSTagendamentos');
const GETagendamentosRoute = require('./routes/agendamentos/GETagendamentos');
const PUTpacientes = require('./routes/pacientes/PUTpacientes')
const DELETEpacientes = require('./routes/pacientes/DELETEpaciente')

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
app.use('/api/usuarios', PUTusuarios);
app.use('/api/usuarios', PUTsenha);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
