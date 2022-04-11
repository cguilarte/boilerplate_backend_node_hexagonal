import { createContainer, asValue, asClass, asFunction } from 'awilix';
import path from 'path';
import config from '../config/env';
import server from '.';
import Routes from '../routes/';
import checkAuth from '../middleware/checkAuth';
import cacheUrl from '../middleware/cache';
import logger from '../middleware/logger';
import mail from '../config/mail';
import elasticClient from '../config/elastic';
const container = createContainer();

// Dir
const pathRouter = path.join(__dirname, '..', 'routes');
const pathController = path.join(__dirname, '..', 'controllers');
const pathRepository = path.join(__dirname, '..', 'dal/repositories');
const pathServices = path.join(__dirname, '..', 'services');
const pathModels = path.join(__dirname, '..', 'dal/models');

// Init Container
container
  // middleware
  .register({
    checkAuth: asFunction(checkAuth).singleton(),
    cacheUrl: asFunction(cacheUrl).singleton(),
    logger: asValue(logger),
    mail: asValue(mail),
  })
  // Configurations
  .register({
    server: asClass(server).singleton(),
    router: asFunction(Routes).singleton(),
    config: asValue(config),
  })

  // Registro de elastisearch (Motor de text)
  .register({
    elasticClient: asValue(elasticClient),
  });

// Registro de los modelos
container.loadModules([`${pathModels}/*.js`], {
  resolverOptions: {
    register: asValue,
  },
});

// Registro de los Routes
container.loadModules([`${pathRouter}/*.js`], {
  resolverOptions: {
    register: asFunction,
  },
});

// Reguistra las tipo asClass/asFunction
container.loadModules(
  [`${pathController}/*.js`, `${pathServices}/*.js`, `${pathRepository}/*.js`],
  {
    resolverOptions: {
      register: asClass,
    },
  },
);

module.exports = container;
