'use strict';

exports = module.exports = function() {
  return {
    appName: _getEnv('ENV_NAME', 'OrintDBPerfomanceTester'),
    environment: _getEnv('NODE_ENV', 'local'),
    port: _getEnv('ENV_PORT', 8000),
    workerCount: _getEnv('NUMBER_OF_WORKERS', require('os').cpus().length),
    intervalOfWorkerCheck: _getEnv('INTERVAL_OF_WORKER_CHECK_MS', 1000),
    dbParams: {
      host: _getEnv('DB_HOST', '52.35.253.219'),
      port: _getEnv('DB_PORT', 2424),
      username: _getEnv('DB_USERNAME', 'admin'),
      password: _getEnv('DB_PASSWORD', 'admin'),
      pool: {
        max: 3
      },
    },
    dbName: _getEnv('DB_DATABASE', 'worldventures'),
    dataDogApiKey: _getEnv('DATADOG_API_KEY', '5a745555c4564194a7bece51d619a033'),
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

function _getNodeId() {
  let node_id = _getEnv('NODE_ID', 0);
  if (typeof node_id !== 'string') return node_id;
  return parseInt(node_id.replace("nodejs-load-generator-", ""));
}
