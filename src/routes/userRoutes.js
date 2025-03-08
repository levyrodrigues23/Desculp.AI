import express from 'express';
import { registerUser, loginUser, alterarSenha, minhasDesculpas } from '../controllers/userController.js';
import { validateRegisterUser } from '../validators/userValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import authenticateToken from '../middlewares/authMiddlewares.js'; // Importação correta


const router = express.Router();

router.post('/registro', validateRegisterUser, validateRequest, registerUser);
router.post('/login', loginUser);
router.put('/alterar-senha', authenticateToken, alterarSenha); // Adicione o middleware de autenticação
router.get('/minhas-desculpas', minhasDesculpas);

export default router;
