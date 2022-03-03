import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const container = require('./src/startup/container');
const server = container.resolve('server');
const initDB = require('./src/config/database');

server
  .start(__dirname)
  .then(async () => {
    initDB();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
