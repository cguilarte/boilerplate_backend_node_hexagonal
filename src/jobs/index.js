import cron from 'node-cron';

module.exports = {
  initCron: (config) => {
    Object.keys(config).forEach((key) => {
      if (cron.validate(config[key].frequency)) {
        cron.schedule(config[key].frequency, () => {
          const handler = require('./' + config[key].handler);
          handler();
        });
      }
    });
  },
};
