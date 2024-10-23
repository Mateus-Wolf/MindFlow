// Importar as dependências necessárias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rotas
const GETusuarios = require('./routes/usuarios/GETusuarios');
const POSTlogin = require('./routes/usuarios/POSTusuario');
const POSTregistroUsuarios = require('./routes/usuarios/POSTregistroUsuarios');
const PUTusuarios = require('./routes/usuarios/PUTusuarios');
const PUTsenha = require('./routes/usuarios/PUTsenha');

const POSTagendamentosRoute = require('./routes/agendamentos/POSTagendamentos');
const GETagendamentosRoute = require('./routes/agendamentos/GETagendamentos');
const GETagendamentosMensaisRoute = require('./routes/agendamentos/GetagendamentosMensais');

const GETpacientes = require('./routes/pacientes/GETpacientes');
const PUTpacientes = require('./routes/pacientes/PUTpacientes');
const DELETEpacientes = require('./routes/pacientes/DELETEpaciente');

const POSTavaliacaoHumor = require('./routes/avalicaoHumor/POSTavaliacao');
const GETregistro = require('./routes/avalicaoHumor/GETregistros');

// Configurar o dotenv
dotenv.config();

// Inicializar o aplicativo Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Definindo as rotas
app.use('/api/usuarios', GETusuarios);
app.use('/api/login', POSTlogin);
app.use('/api/usuarios', POSTregistroUsuarios);
app.use('/api/usuarios', PUTusuarios);
app.use('/api/usuarios/senha', PUTsenha);

app.use('/api/agendamentos', GETagendamentosRoute);
app.use('/api/agendamentos', GETagendamentosMensaisRoute);
app.use('/api/agendamentos', POSTagendamentosRoute);


app.use('/api/pacientes', GETpacientes);
app.use('/api/pacientes', PUTpacientes);
app.use('/api/pacientes', DELETEpacientes);


app.use('/api/pacientes', GETregistro);
app.use('/api/avaliacaoHumor', POSTavaliacaoHumor);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
