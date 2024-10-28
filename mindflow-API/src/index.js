const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar rotas
const GETusuarios = require('./routes/usuarios/GETusuarios');
const POSTlogin = require('./routes/usuarios/POSTusuario');
const POSTregistroUsuarios = require('./routes/usuarios/POSTregistroUsuarios');
const PUTusuarios = require('./routes/usuarios/PUTusuarios');
const PUTnovaSenha  = require('./routes/usuarios/PUTnovaSenha');
const CRUDfotos = require('./routes/usuarios/CRUDfotos');

const POSTagendamentosRoute = require('./routes/agendamentos/POSTagendamentos');
const GETagendamentosRoute = require('./routes/agendamentos/GETagendamentos');
const GETagendamentosMensaisRoute = require('./routes/agendamentos/GetagendamentosMensais');

const GETpacientes = require('./routes/pacientes/GETpacientes');
const PUTpacientes = require('./routes/pacientes/PUTpacientes');
const DELETEpacientes = require('./routes/pacientes/DELETEpaciente');

const POSTavaliacaoHumor = require('./routes/avalicaoHumor/POSTavaliacao');
const GETregistro = require('./routes/avalicaoHumor/GETregistros');
const GETvisualizarHumor = require('./routes/avalicaoHumor/GETvisualizarHumor');

// Configurar o dotenv
dotenv.config();

// Inicializar o aplicativo Express
const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Middleware
app.use(cors());

// Definindo as rotas
app.use('/api/usuarios', GETusuarios);
app.use('/api/login', POSTlogin);
app.use('/api/usuarios', POSTregistroUsuarios);
app.use('/api/usuarios', PUTusuarios);
app.use('/api/usuarios', PUTnovaSenha);
app.use('/api/usuarios', CRUDfotos);

app.use('/api/agendamentos', GETagendamentosRoute);
app.use('/api/agendamentos', GETagendamentosMensaisRoute);
app.use('/api/agendamentos', POSTagendamentosRoute);

app.use('/api/pacientes', GETpacientes);
app.use('/api/pacientes', PUTpacientes);
app.use('/api/pacientes', DELETEpacientes);

app.use('/api/pacientes', GETregistro);
app.use('/api/avaliacaoHumor', POSTavaliacaoHumor);
app.use('/api', GETvisualizarHumor);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
