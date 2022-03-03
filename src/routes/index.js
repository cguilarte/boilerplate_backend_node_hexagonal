import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

module.exports = function ({ userRoutes }) {
  const router = express.Router();
  const apiRoutes = express.Router();

  apiRoutes.use(express.json()).use(cors()).use(helmet()).use(compression());
  apiRoutes.use('/users', userRoutes);
  router.use('/api/v1/', apiRoutes);

  return router;
};
