import path from 'path';
import morgan from 'morgan';
import logger from '../middleware/logger';
import express from 'express';
import helmet from 'helmet';
// import errorHandler from 'errorhandler';
import { errorHandler, notFound } from '../middleware/errorRest.js';
import cookieParser from 'cookie-parser';

// CrontTab
import configCron from '../jobs/config';
import sheduler from '../jobs';

let _app = null;
let _config = null;
let _router = null;

class Server {
  constructor({ config, router }, dir = '') {
    _app = express();
    _config = config;
    _router = router;
  }

  start(_dir) {
    return new Promise((resolve) => {
      _app.use(
        morgan('short', {
          stream: {
            write: (message) => logger.info(message.trim()),
          },
        }),
      );

      // Public images
      const dir = path.join(_dir, 'public');
      _app.use(express.static(dir));

      _app.use(express.urlencoded({ extended: true }));
      _app.use(express.json());
      _app.use(helmet());

      _app.use(cookieParser());

      _app.use(_router);

      // Error handle
      _app.use(notFound);
      _app.use(errorHandler);

      // Jobs
      sheduler.initCron(configCron);

      // Initialization server
      _app.listen(_config.PORT, () => {
        console.log(
          `✅ API - ${
            _config.APPLICATION_NAME + ' running on port: ' + _config.PORT
          } `,
        );
      });

      resolve();
    });
  }
}

module.exports = Server;
