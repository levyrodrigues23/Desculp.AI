import { body } from 'express-validator';

export const validateRegisterUser = [
  body('nomeBase')
    .notEmpty().withMessage('O nomeBase é obrigatório')
    .isLength({ min: 3 }).withMessage('O nomeBase deve ter pelo menos 3 caracteres'),

  body('email')
    .isEmail().withMessage('O e-mail deve ser válido'),

  body('senha')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
];
