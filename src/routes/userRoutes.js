import express from 'express';
import { registerUser, loginUser, alterarSenha, minhasDesculpas } from '../controllers/userController.js';

const router = express.Router();

router.post('/registro', registerUser); // Registro de usuário
router.post('/login', loginUser); // Login de usuário
router.put('/alterar-senha', alterarSenha); // Alteração de senha
router.get('/minhas-desculpas', minhasDesculpas); // Minhas desculpas

export default router;
