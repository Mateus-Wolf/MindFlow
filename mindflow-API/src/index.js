const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rotas
const GETusuarios = require('./routes/usuarios/GETusuarios');
const POSTlogin = require('./routes/usuarios/POSTusuario'); // Importar a nova rota
const POSTregistroUsuarios = require('./routes/usuarios/POSTregistroUsuarios');
const PUTusuarios = require('./routes/usuarios/PUTusuarios');
const PUTsenha = require('./routes/usuarios/PUTsenha');
const PUTagendamentosRoute = require('./routes/agendamentos/POSTagendamentos');
const GETagendamentosRoute = require('./routes/agendamentos/GETagendamentos');
const GETagendamentosMensaisRoute = require('./routes/agendamentos/GetagendamentosMensais');
const GETpacientes = require('./routes/pacientes/GETpacientes');
const PUTpacientes = require('./routes/pacientes/PUTpacientes');
const DELETEpacientes = require('./routes/pacientes/DELETEpaciente');

// Configurar o dotenv
dotenv.config();

// Inicializar o aplicativo Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Definindo as rotas
app.use('/api/usuarios', GETusuarios); // Rota para GET usuários
app.use('/api/login', POSTlogin); // Rota para login (POST)
app.use('/api/usuarios', POSTregistroUsuarios); // Rota para POST usuários (registro)
app.use('/api/usuarios', PUTusuarios);
app.use('/api/usuarios', PUTsenha);

app.use('/api/agendamentos', GETagendamentosRoute);
app.use('/api/agendamentos', GETagendamentosMensaisRoute);
app.use('/api/agendamentos', PUTagendamentosRoute);

app.use('/api/pacientes', GETpacientes);
app.use('/api/pacientes', PUTpacientes);
app.use('/api/pacientes', DELETEpacientes);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
