-- Cria o banco de dados
CREATE DATABASE MindFlow;

-- **Conecte-se ao banco de dados MindFlow antes de executar as próximas instruções**

-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nascimento DATE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL
);

-- Tabela de pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    medico_id INT REFERENCES usuarios(id) ON DELETE SET NULL, -- Ajuste para permitir que o médico seja removido
    nome VARCHAR(100) NOT NULL,
    idade INT NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,  -- Alterado para VARCHAR(11)
    cep VARCHAR(10) NOT NULL,
    genero VARCHAR(10) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    estado_civil VARCHAR(20) NOT NULL,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE -- Movido para cá
);

-- Tabela de relatórios
CREATE TABLE relatorios (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id) ON DELETE CASCADE,
    mes INT NOT NULL,
    ano INT NOT NULL,
    dias_com_5_estrelas INT,
    dias_na_media INT,
    dias_com_1_estrela INT,
    relacao_5_estrelas_tarefas TEXT,
    relacao_1_estrela_tarefas TEXT
);

-- Tabela de registros de humor
CREATE TABLE registros_humor (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id) ON DELETE CASCADE,
    relatorio_id INT REFERENCES relatorios(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    qualidade_sono INT CHECK (qualidade_sono BETWEEN 1 AND 5),
    nivel_estresse INT CHECK (nivel_estresse BETWEEN 1 AND 5),
    avaliacao_geral INT CHECK (avaliacao_geral BETWEEN 1 AND 5),
    tarefas_estudo BOOLEAN,
    tarefas_trabalho BOOLEAN,
    tarefas_exercicio BOOLEAN,
    tarefas_lazer BOOLEAN
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    registro_humor_id INT REFERENCES registros_humor(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    descricao TEXT
    hora TIME
);
