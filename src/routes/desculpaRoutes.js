import express from 'express';
import { gerarDesculpa, salvarDesculpa, atualizarDesculpa, excluirDesculpa, votarDesculpa, getDesculpas, getDesculpaById, getRanking } from '../controllers/desculpaController.js';

const router = express.Router();

router.post('/gerar', gerarDesculpa); // Rota para gerar pedido de desculpa
router.post('/', salvarDesculpa); // Rota para criar um novo pedido de desculpa
router.put('/:id', atualizarDesculpa); // Rota para atualizar um pedido de desculpa
router.delete('/:id', excluirDesculpa); // Rota para excluir um pedido de desculpa
router.post('/:id/votar', votarDesculpa); // Rota para votar em um pedido de desculpa

router.get('/', getDesculpas); // Rota para buscar todas as desculpas
router.get('/:id', getDesculpaById); // Rota para buscar uma desculpa por ID
router.get('/ranking', getRanking); // Rota para pegar o ranking de desculpas

export default router;
