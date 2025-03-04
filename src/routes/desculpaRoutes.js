import express from 'express';
import { gerarDesculpa, criarDesculpa, atualizarDesculpa, excluirDesculpa, votarDesculpa, getDesculpas, getDesculpaById, getRanking } from '../controllers/desculpaController.js';


const router = express.Router();

router.post('/gerar', gerarDesculpa); // Rota para gerar pedido de desculpa
router.post('/', criarDesculpa); // Rota para criar um novo pedido de desculpa
router.put('/:id', atualizarDesculpa); // Rota para atualizar um pedido de desculpa
router.delete('/:id', excluirDesculpa); // Rota para excluir um pedido de desculpa
router.post('/:id/votar', votarDesculpa); // Rota para votar em um pedido de desculpa

router.get('/', getDesculpas);
router.get('/:id', getDesculpaById);
router.get('/ranking', getRanking);

export default router;
