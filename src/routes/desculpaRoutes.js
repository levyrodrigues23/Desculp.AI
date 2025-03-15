import express from 'express';
import authenticateToken from '../middlewares/authMiddlewares.js';
import {
  gerarDesculpa,
  salvarDesculpa,
  atualizarDesculpa,
  excluirDesculpa,
  votarDesculpa,
  getDesculpas,
  getDesculpaById,
  getRanking
} from '../controllers/desculpaController.js';

const router = express.Router();

// Rotas para pedidos de desculpa
router.post('/gerar', gerarDesculpa); // Gerar pedido de desculpa
router.post('/', authenticateToken, salvarDesculpa); // Criar um novo pedido de desculpa
router.put('/:id', authenticateToken, atualizarDesculpa); // Atualizar um pedido de desculpa
router.delete('/:id', authenticateToken, excluirDesculpa); // Excluir um pedido de desculpa
router.post('/:id/votar', authenticateToken, votarDesculpa); // Votar em um pedido de desculpa

// Rotas para obtenção de pedidos de desculpa
router.get('/ranking', getRanking); // ranking precisa ficar mais acima
router.get('/:id', getDesculpaById);
router.get('/', getDesculpas);

export default router;
