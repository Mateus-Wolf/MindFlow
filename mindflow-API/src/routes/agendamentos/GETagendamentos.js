const express = require('express');
const router = express.Router();
const db = require('../../db');

// Rota para buscar agendamentos por data com dados do paciente
router.get('/', async (req, res) => {
    const { data, usuario_id } = req.query; // Data e usuario_id enviados como query
    try {
        const agendamentos = await db.query(`
            SELECT a.*, p.nome 
            FROM agendamentos a 
            JOIN pacientes p ON a.paciente_id = p.id 
            WHERE a.data = $1 AND a.usuario_id = $2`, [data, usuario_id]);
        res.json(agendamentos.rows);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).send('Erro ao buscar agendamentos');
    }
});

// Rota para obter agendamentos de um usuário específico para o mês atual
router.get('/mensal/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    const { mes } = req.query;
  
    console.log("Parâmetros recebidos:", { usuario_id, mes }); 
  
    if (!mes || !usuario_id) {
      return res.status(400).json({ message: 'Parâmetro mês ou usuário ID ausente.' });
    }
  
    try {
      const query = `
        SELECT * FROM agendamentos
        WHERE usuario_id = $1 AND TO_CHAR(data, 'YYYY-MM') = $2
      `;
      const values = [usuario_id, mes];
      const result = await db.query(query, values);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar agendamentos mensais:', error); 
      res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
    }
});
  
// Rota para buscar todos os agendamentos de um usuário específico
router.get('/usuario/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
      const agendamentos = await db.query(`
          SELECT a.*, p.nome 
          FROM agendamentos a 
          JOIN pacientes p ON a.paciente_id = p.id 
          WHERE a.usuario_id = $1
      `, [usuario_id]);
      
      res.json(agendamentos.rows);
  } catch (error) {
      console.error('Erro ao buscar agendamentos do usuário:', error);
      res.status(500).json({ message: 'Erro ao buscar agendamentos do usuário.' });
  }
});

// Rota para buscar todos os agendamentos de um usuário específico com status 1
router.get('/', async (req, res) => {
  const { data, usuario_id } = req.query; // Data e usuario_id enviados como query
  try {
      const agendamentos = await db.query(`
          SELECT a.*, p.nome 
          FROM agendamentos a 
          JOIN pacientes p ON a.paciente_id = p.id 
          WHERE a.data = $1 AND a.usuario_id = $2 AND a.status_id = 1`, 
          [data, usuario_id]
      );
      res.json(agendamentos.rows);
  } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      res.status(500).send('Erro ao buscar agendamentos');
  }
});


module.exports = router;
