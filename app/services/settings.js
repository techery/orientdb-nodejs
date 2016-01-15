'use strict';

exports = module.exports = function () {
    return {
        appName: _getEnv('ENV_NAME', 'OrintDBPerfomanceTester'),
        environment: _getEnv('NODE_ENV', 'local'),
        node: {
            id: parseInt(_getEnv('NODE_ID', 0)),
            count: parseInt(_getEnv('NODE_COUNT', 1)),
            minUserCount: parseInt(_getEnv('NODE_MIN_USER_COUNT', 600000)),
        },
        port: _getEnv('ENV_PORT', 3000),
        workerCount: _getEnv('NUMBER_OF_WORKERS', require('os').cpus().length),
        intervalOfWorkerCheck: _getEnv('INTERVAL_OF_WORKER_CHECK_MS', 1000),
        userPerWorker: _getEnv('USERS_PER_WORKER', 100),
        dbParams: {
            host: _getEnv('DB_HOST', 'localhost'),
            port: _getEnv('DB_PORT', 2424),
            username: _getEnv('DB_USERNAME', 'root'),
            password: _getEnv('DB_PASSWORD', 'r13ntDB'),
        },
        dbName: _getEnv('DB_DATABASE', 'OrintDBPerfomanceTest'),
        userInfo: {
            itemPerFeed: _getEnv('USER_ITEM_PER_FEED', 50),
            chanceLike: _getEnv('USER_CHANCE_LIKE', 0.02),
            chanceRead: _getEnv('USER_CHANCE_READ', 0.02),
            chanceComment: _getEnv('USER_CHANCE_COMMENT', 0.005),
            activityChanceRemoveFriendship: _getEnv('USER_ACTIVITY_TIMEOUT', 300),
            activityChanceNewFriendship: _getEnv('USER_ACTIVITY_CHANCE_REMOVE_FRIENDSHIP', 0.05),
            activityChanceWritePost: _getEnv('USER_ACTIVITY_CHANCE_NEW_FRIENDSHIP', 0.15),
            activityChanceNothing: _getEnv('USER_ACTIVITY_CHANCE_WRITE_POST', 0.8),
            timeoutActivity: _getEnv('USER_ACTIVITY_CHANCE_NOTHING', 0),
        },
        dataDogApiKey: _getEnv('DATADOG_API_KEY', 0),
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
