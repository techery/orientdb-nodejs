'use strict';

exports = module.exports = function(express, randomRepository, settings) {

  class Http {

    constructor(express) {
      this.app = express();
    }

    start() {

      this.app.get('/go/*', function(req, res) {

        let sum = 0;
        let queryType;

        for (queryType in req.query.chance) {
          if(randomRepository.knownQueryTypes.indexOf(queryType) === -1) {
            res.send(`Unknown query type ${queryType}`).end();
          }
          sum = sum + parseInt(req.query.chance[queryType]);
        }

        let chance = Math.floor(Math.random() * sum) + 1;

        for (queryType in req.query.chance) {
          if(chance <= req.query.chance[queryType]) {
            break;
          } else {
            chance = chance - req.query.chance[queryType];
          }
        }

        process.send({type: 'start', queryType: queryType});
        let startTime = process.hrtime();

        randomRepository.query(queryType, req.query.chunk)
          .then((r) => {
            let timing = process.hrtime(startTime);
            process.send({type: 'end', queryType: queryType, time: timing[0] * 1e9 + timing[1]});
            res.send(queryType).end();
          })
          .catch((e) => {
            let timing = process.hrtime(startTime);
            process.send({type: 'error', queryType: queryType, time: timing[0] * 1e9 + timing[1]});
            res.send(queryType).end();
          });

      });

      this.server = this.app.listen(settings.port);

    }

    stop() {
      this.server.close();
    }
  }

  return new Http(express);
};

exports['@singleton'] = true;
exports['@require'] = ['express', 'randomRepository', 'settings'];
