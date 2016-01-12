'use strict';

exports = module.exports = function (writer, logger) {
    logger.info('New writer started');
    writer.init().then(writer.run).then(writer.end);

    process.once('SIGTERM', () => {
        writer.exit();
        logger.info('Writer stopped');
        process.exit(0);
    });
};

exports['@require'] = ['writer', 'logger'];
