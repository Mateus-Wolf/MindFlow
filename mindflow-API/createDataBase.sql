CREATE DATABASE mindflow

-- Tabela de Status de Agendamentos
CREATE TABLE agendamento_status (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL
);

-- Inserção dos tipos de status de agendamentos
INSERT INTO agendamento_status (descricao) VALUES
('Agendado'),
('Consulta Realizada'),
('Consulta Cancelada'),
('Consulta Atrasada');

-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nascimento DATE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL,
    imagem BYTEA
);

-- Tabela de pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    medico_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    idade INT NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL, 
    cep VARCHAR(10) NOT NULL,
    genero VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    estado_civil VARCHAR(20) NOT NULL,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    alergia VARCHAR(50),
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    descricao TEXT,
    hora TIME,
    status_id INT REFERENCES agendamento_status(id) DEFAULT 1 
);

-- Tabela de registros de humor
CREATE TABLE registros_humor (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id) ON DELETE CASCADE,
    agendamento_id INT REFERENCES agendamentos(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    qualidade_sono INT CHECK (qualidade_sono BETWEEN 1 AND 5),
    nivel_estresse INT CHECK (nivel_estresse BETWEEN 1 AND 5),
    nivel_energia INT CHECK (nivel_energia BETWEEN 1 AND 5),
    avaliacao_geral INT CHECK (avaliacao_geral BETWEEN 1 AND 5),
    tarefas_estudo BOOLEAN,
    tarefas_trabalho BOOLEAN,
    tarefas_exercicio BOOLEAN,
    tarefas_lazer BOOLEAN,
    observacoes VARCHAR(500)
);

-- Adicionando colunas para recuperação de senha no usuário
ALTER TABLE usuarios
ADD COLUMN codigo_recuperacao VARCHAR(255),
ADD COLUMN expiracao_codigo TIMESTAMP;  

-- Adicionando colunas para registro de humor
ALTER TABLE agendamentos 
ADD COLUMN registro_humor_id INTEGER ;