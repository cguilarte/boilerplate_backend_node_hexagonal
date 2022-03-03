import logger from '../../middleware/logger';

module.exports = async () => {
  try {
    console.log('initial job ✅');
  } catch (error) {
    logger.error(error);
  }
};
