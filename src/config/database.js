import mongoose from 'mongoose';
import logger from '../middleware/logger';
import { DB_URI } from './env';

module.exports = () => {
  mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('✅ Database connected');
    })
    .catch((error) => {
      logger.error(error);
      console.log('❌ Database not connected');
    });
};
