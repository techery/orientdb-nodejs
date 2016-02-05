'use strict';

exports = module.exports = function(logger, http) {
  logger.info('New worker started');

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);

  function stop() {
    logger.info(`Worker #${process.pid} stopped`);
    http.stop();
    process.exit(0);
  }
};

exports['@require'] = ['logger', 'http'];
