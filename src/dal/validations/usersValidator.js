import { check } from 'express-validator';
import { validateResult } from '../../helpers/validateHelper';

const validateCreate = [
  check('name').exists().withMessage('Ingrese un nombre valido.'),
  check('email').exists().isEmail().withMessage('Email invalido.'),
  check('password')
    .exists()
    .not()
    .withMessage('Ingrese una contraseña valida.'),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validateCreate };
