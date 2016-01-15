'use strict';

exports = module.exports = function (datadog, settings, os) {
    return new datadog.BufferedMetricsLogger({
        apiKey: settings.dataDogApiKey,
        host: os.hostname,
        prefix: `node_${settings.node.id}.`,
        flushIntervalSeconds: 0
    });
};

exports['@singleton'] = true;
exports['@require'] = ['datadog-metrics', 'settings', 'os'];
