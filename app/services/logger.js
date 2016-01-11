'use strict';

exports = module.exports = function (bunyan, settings) {
    var logger = bunyan.createLogger({
        name: settings.appName,
        streams: [
            {level: 'debug', stream: process.stdout},
            {level: 'error', path: 'logs/error.log'},
        ],
    });
    if (settings.environment === 'test') {
        //TODO: Remove monkey patching. This remove print info message in stdout when testing.
        logger.info = function () {
        };
    }

    return logger;
};

exports['@singleton'] = true;
exports['@require'] = ['bunyan', 'settings'];
