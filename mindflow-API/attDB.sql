BEGIN;

-- Remove a coluna id_medico
ALTER TABLE pacientes DROP COLUMN IF EXISTS id_medico;

-- Adiciona a nova coluna usuario_id
ALTER TABLE pacientes ADD COLUMN usuario_id INT;

-- Define a chave estrangeira
ALTER TABLE pacientes ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

COMMIT;
