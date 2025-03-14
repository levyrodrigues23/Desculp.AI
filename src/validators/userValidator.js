import { body } from 'express-validator';

export const validateRegisterUser = [
  body('nomeBase')
    .notEmpty().withMessage('O nomeBase é obrigatório')
    .isLength({ min: 3 }).withMessage('O nomeBase deve ter pelo menos 3 caracteres'),

  body('email')
    .optional() 
    .isEmail().withMessage('Se fornecido, o e-mail deve ser válido'),

  body('senha')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
];

export const validateAlterarSenha = [
  body('senhaAtual')
    .notEmpty().withMessage('A senha atual é obrigatória'),
    
  body('novaSenha')
    .isLength({ min: 6 }).withMessage('A nova senha deve ter pelo menos 6 caracteres')
    .custom((value, { req }) => {
      if (value === req.body.senhaAtual) {
        throw new Error('A nova senha deve ser diferente da senha atual');
      }
      return true;
    })
];
