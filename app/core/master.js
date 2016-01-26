'use strict';

exports = module.exports = function(cluster, settings, logger, metrics) {
  var queries = {
    allQueries: {timeFrames: [], processing: 0},
    createPost: {timeFrames: [], processing: 0},
    updatePost: {timeFrames: [], processing: 0},
    getUserInfo: {timeFrames: [], processing: 0},
    getUserPosts: {timeFrames: [], processing: 0},
    getUserFriends: {timeFrames: [], processing: 0},
    getUserFriendPosts: {timeFrames: [], processing: 0},
  }

  for (var i = 0; i < settings.workerCount; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    logger.info(`Worker with pid: ${worker.process.pid} has started!`);
  });

  cluster.on('exit', refreshWorker);

  cluster.on('message', (m) => {
    if (m.type === 'start') {
      queries.allQueries.processing++;
      queries[m.queryType].processing++;
    }
    if (m.type === 'end') {
      queries.allQueries.processing--;
      queries.allQueries.timeFrames.push(m.time);
      queries[m.queryType].processing--;
      queries[m.queryType].timeFrames.push(m.time);
    }
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
    let queryType;
    for (queryType in queries) {
      metrics.gauge(`${queryType}.processing`, queries[queryType].processing);
      if (queries[queryType].timeFrames.length) {
        metrics.gauge(`${queryType}.done`, queries[queryType].timeFrames.length);
        metrics.gauge(`${queryType}.time.max`, makeMax(queries[queryType].timeFrames) / 1e9);
        metrics.gauge(`${queryType}.time.min`, makeMin(queries[queryType].timeFrames) / 1e9);
        metrics.gauge(`${queryType}.time.avg`, makeAvg(queries[queryType].timeFrames) / 1e9);
        queries[queryType].timeFrames = [];
      }
    }
    metrics.flush();
  }

  function makeAvg(timeFrames) {
    let timeTotal = timeFrames.reduce(function(sum, value) {
      return sum + value;
    }, 0);
    return timeTotal / timeFrames.length;
  }

  function makeMin(timeFrames) {
    return Math.min.apply(null, timeFrames);
  }

  function makeMax(timeFrames) {
    return Math.max.apply(null, timeFrames);
  }

}
;

exports['@singleton'] = true;
exports['@require'] = ['cluster', 'settings', 'logger', 'metrics', 'randomRepository'];
