import logger from '../middleware/logger';

exports.notFound = (req, res, next) => {
  const error = new Error(`No Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(error.message);
  res.status(statusCode);
  res.json({
    error: true,
    status: statusCode,
    message: error.message,
    stack:
      process.env.NODE_ENV === 'production'
        ? 'Consulte con el administrador'
        : error.stack,
  });
};
