'use strict';

exports = module.exports = function (cluster, settings, logger) {
    var counts = {request: 0, error: 0};

    for (var i = 0; i < settings.workerCount; i++) {
        cluster.fork();
    }

    cluster.on('online', worker => {
        logger.info(`Worker with pid: ${worker.process.pid} has started!`);
    });

    cluster.on('exit', refreshWorker);

    cluster.on('message', (m) => {
        counts[m.type]++;
    });

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);

    setInterval(checkWorkers, settings.intervalOfWorkerCheck);

    function stop() {
        logger.info('Stopping workers.');
        cluster.removeListener('exit', refreshWorker);
        for (var id in cluster.workers) {
            cluster.workers[id].kill('SIGUSR2');
        }
        setTimeout(() => {
            logger.info('All workers are stopped.');
            logResult();
            process.exit(0);
        }, 100);
    }

    function refreshWorker(deadWorker, code, signal) {
        var oldPID = deadWorker.process.pid;
        var worker = cluster.fork();
        var newPID = worker.process.pid;

        logger.info(`Worker with pid: ${oldPID} died. Replacing with worker with pid: ${newPID}.`);
    }

    function checkWorkers() {
        logResult();
        var activeWorkers = Object.keys(cluster.workers).length;
        for (var i = 0; i < (settings.workerCount - activeWorkers); i++) {
            cluster.fork();
        }
    }

    function logResult() {
        const util = require('util');
        let requests = counts.request + counts.error;
        let message = `
            Time: ${process.uptime()}.
            Counts: ${JSON.stringify(counts)}.
            RPS: ${requests/process.uptime()}
            Error level: ${counts.error/requests}
            Memory: ${util.inspect(process.memoryUsage())
            }`;
        logger.info(message);
    }
};

exports['@singleton'] = true;
exports['@require'] = ['cluster', 'settings', 'logger'];
