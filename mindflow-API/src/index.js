const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const db = require('./db')
const allowedOrigins = ['http://localhost:3001', 'http://mindflow-api:3000', 'http://localhost:3000'];


// Importação das Rotas

//usuarios
const GETusuarios = require('./routes/usuarios/GETusuarios');
const POSTlogin = require('./routes/usuarios/POSTusuario');
const POSTregistroUsuarios = require('./routes/usuarios/POSTregistroUsuarios');
const PUTusuarios = require('./routes/usuarios/PUTusuarios');
const POSTrecuperarSenha  = require('./routes/usuarios/POSTrecuperarSenha');
const CRUDfotos = require('./routes/usuarios/CRUDfotos');
const { enviarEmail } = require('./emailService');

//agendamentos
const POSTagendamentosRoute = require('./routes/agendamentos/POSTagendamentos');
const PUTagendamentosRoute = require('./routes/agendamentos/PUTagendamentos');
const GETagendamentosRoute = require('./routes/agendamentos/GETagendamentos');
const GETagendamentosMensaisRoute = require('./routes/agendamentos/GetagendamentosMensais');
const GETagendamentosRecentes = require('./routes/agendamentos/GETagendamentosRecentes');

//pacientes
const GETpacientes = require('./routes/pacientes/GETpacientes');
const PUTpacientes = require('./routes/pacientes/PUTpacientes');
const DELETEpacientes = require('./routes/pacientes/DELETEpaciente');

//avaliação humor
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
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

// Definindo as rotas

//usuarios
app.use('/api/usuarios', GETusuarios);
app.use('/api/login', POSTlogin);
app.use('/api/usuarios', POSTregistroUsuarios);
app.use('/api/usuarios', PUTusuarios);
app.use('/api', POSTrecuperarSenha);
app.use('/api/usuarios', CRUDfotos);

//agendamentos
app.use('/api/agendamentos', GETagendamentosRoute);
app.use('/api/agendamentos', GETagendamentosMensaisRoute);
app.use('/api/agendamentos', POSTagendamentosRoute);
app.use('/api/agendamentos', PUTagendamentosRoute);
app.use('/api/agendamentos', GETagendamentosRecentes);

//pacientes
app.use('/api/pacientes', GETpacientes);
app.use('/api/pacientes', PUTpacientes);
app.use('/api/pacientes', DELETEpacientes);

//avaliação humor
app.use('/api/pacientes', GETregistro);
app.use('/api/avaliacaoHumor', POSTavaliacaoHumor);
app.use('/api', GETvisualizarHumor);

// Rota padrão
app.get('/', (req, res) => {
    res.send('API do MindFlow');
});

// Função para atualizar o status dos agendamentos para Cancelado
const atualizarStatusAgendamentos = async () => {
    try {
        const now = new Date();
        const query = `
            UPDATE agendamentos
            SET status = 4
            WHERE id = 1 AND data_hora < $1
            RETURNING *;
        `;

        const result = await db.query(query, [now]);

        if (result.rowCount > 0) {
            console.log('Status dos agendamentos atualizado com sucesso!', result.rows);
        } else {
            console.log('Nenhum agendamento encontrado para atualizar.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o status dos agendamentos:', error);
    }
};
cron.schedule('0 0 * * *', atualizarStatusAgendamentos);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
