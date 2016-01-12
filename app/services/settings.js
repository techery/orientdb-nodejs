'use strict';

exports = module.exports = function () {
    return {
        appName: _getEnv('ENV_NAME', 'OrintDBPerfomanceTester'),
        environment: _getEnv('NODE_ENV', 'local'),
        port: _getEnv('ENV_PORT', 3000),
        workerCount: _getEnv('NUMBER_OF_WORKERS', 2),
        intervalOfWorkerCheck: _getEnv('INTERVAL_OF_WORKER_CHECK_MS', 5000),
        dbParams: {
            host: _getEnv('DB_HOST', 'localhost'),
            port: _getEnv('DB_PORT', 2424),
            username: _getEnv('DB_USERNAME', 'root'),
            password: _getEnv('DB_PASSWORD', 'r13ntDB'),
        },
        dbName: _getEnv('DB_DATABASE', 'OrintDBPerfomanceTest'),
        dbClassName: _getEnv('DB_USER_CLASS', 'User'),
    };
};

exports['@singleton'] = true;

/**
 * @param key
 * @param defaultValue
 * @returns {*}
 * @private
 */
function _getEnv(key, defaultValue) {
    return process.env[key] || defaultValue;
}
