'use strict';

exports = module.exports = function (cluster, settings, logger) {
    for (var i = 0; i < settings.workerCount; i++) {
        cluster.fork();
    }

    cluster.on('online', worker => {
        logger.info(`Worker with pid: ${worker.process.pid} has started!`);
    });

    cluster.on('exit', refreshWorker);

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);

    function stop() {
        logger.info('Stopping workers.');
        cluster.removeListener('exit', refreshWorker);
        for (var id in cluster.workers) {
            cluster.workers[id].kill('SIGUSR2');
        }
        setTimeout(() => {
            logger.info('All workers are stopped.');
            process.exit(0);
        }, 100);
    }

    function refreshWorker(deadWorker, code, signal) {
        var oldPID = deadWorker.process.pid;
        if (signal === 'SIGUSR2') {
            logger.info(`Worker with pid: ${oldPID} terminated with user signal from master.`);
            return;
        }

        var worker = cluster.fork();
        var newPID = worker.process.pid;

        logger.info(`Worker with pid: ${oldPID} died. Replacing with worker with pid: ${newPID}.`);
    }

    setInterval(() => {
        logger.info('Check workers');
        var activeWorkers = Object.keys(cluster.workers).length;
        for (var i = 0; i < (settings.workerCount - activeWorkers); i++) {
            cluster.fork();
        }
    }, settings.intervalOfWorkerCheck);
};

exports['@singleton'] = true;
exports['@require'] = ['cluster', 'settings', 'logger'];
