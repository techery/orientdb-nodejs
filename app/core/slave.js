'use strict';

exports = module.exports = function (user, logger) {
    logger.info('New worker started');
    user.init().then(user.run);

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);

    function stop() {
        logger.info(`Worker #${process.pid} stopped`);
        user.end();
        process.exit(0);
    }
};

exports['@require'] = ['user', 'logger'];
