'use strict';

exports = module.exports = function(express, randomRepository, settings) {

  class Http {
    constructor(express) {
      this.app = express();
      this.server = this.app.listen(settings.port);

      this.app.all('/*', function(req, res) {
        let queryType = randomRepository.makeQueryType();
        process.send({type: 'start', queryType: queryType});
        let startTime = process.hrtime();
        randomRepository.query(queryType)
          .then((r) => {
            let timing = process.hrtime(startTime);
            process.send({type: 'end', queryType: queryType, time: timing[0] * 1e9 + timing[1]});
            res.send(queryType).end();
          })
          .catch((e) => {
            let timing = process.hrtime(startTime);
            process.send({type: 'end', queryType: queryType, time: timing[0] * 1e9 + timing[1]});
            res.send(queryType).end();
          });
      });

    }

    stop() {
      this.server.close();
    }
  }

  return new Http(express);
};

exports['@singleton'] = true;
exports['@require'] = ['express', 'randomRepository', 'settings'];
