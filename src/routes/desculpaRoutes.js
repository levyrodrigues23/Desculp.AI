import express from 'express';
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
router.post('/', salvarDesculpa); // Criar um novo pedido de desculpa
router.put('/:id', atualizarDesculpa); // Atualizar um pedido de desculpa
router.delete('/:id', excluirDesculpa); // Excluir um pedido de desculpa
router.post('/:id/votar', votarDesculpa); // Votar em um pedido de desculpa

// Rotas para obtenção de pedidos de desculpa
router.get('/', getDesculpas);
router.get('/:id', getDesculpaById);
router.get('/ranking', getRanking);

export default router;
