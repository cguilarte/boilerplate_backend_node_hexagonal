import { Router } from 'express';
// Validaciones
import { validateCreate } from '../dal/validations/usersValidator';

module.exports = function ({ userController }) {
  const router = Router();
  router.post('/login', userController.login.bind(userController));
  router.post(
    '/signup',
    validateCreate,
    userController.signup.bind(userController),
  );
  router.post(
    '/verifyAccount',
    userController.verifyAccount.bind(userController),
  );
  router.post(
    '/recoveryAccount',
    userController.recoveryAccount.bind(userController),
  );
  router.post(
    '/changePassword',
    userController.changePassword.bind(userController),
  );

  return router;
};
