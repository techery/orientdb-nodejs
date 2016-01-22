'use strict';

exports = module.exports = function(db, logger, EventEmitter) {

  class Reporter {
    constructor(db, logger, EventEmitter) {
      this.db = db;
      this.logger = logger;
      this.suits = [];
      this.currentQuery = {
        suitId: 0,
        index: 0,
        timeout: undefined
      };
      this.eventEmitter = new EventEmitter();
      this.eventEmitter.on('queryDone', (result, startTime) => {
        clearTimeout(this.currentQuery.timeout);
        this.suits[this.currentQuery.suitId].timeFrames.push(process.hrtime(startTime));
        this.nextQuery();
      });
      this.eventEmitter.on('queryError', (error, startTime) => {
        clearTimeout(this.currentQuery.timeout);
        this.suits[this.currentQuery.suitId].errors.push(error);
        this.nextQuery();
      });
      this.promise = {
        resolve: () => {
        },
        reject: () => {
        }
      }
    }

    run() {
      this.db.open().then(()=> {
        this.nextQuery();
      });
      return new Promise((resolve, reject) => {
        this.promise.resolve = resolve;
        this.promise.reject = reject;
      });
    }

    nextQuery() {
      if (this.currentQuery.index >= this.suits[this.currentQuery.suitId].count) {
        this.currentQuery.index = 1;
        if (this.currentQuery.suitId >= this.suits.length - 1) {
          this.write();
          return this.promise.resolve();
        } else {
          this.currentQuery.suitId++;
        }
      } else {
        this.currentQuery.index++;
      }
      let query = this.suits[this.currentQuery.suitId].queryMaker(this.currentQuery.index - 1);
      let startTime = process.hrtime();
      this.currentQuery.timeout = setTimeout(() => {
        this.eventEmitter.emit('queryError', new Error('Break by timeout'), startTime);
      }, 5000);
      return this.db.query(query).then((r) => {
        this.eventEmitter.emit('queryDone', r, startTime);
      }).catch((e) => {
        this.eventEmitter.emit('queryError', e, startTime);
      });
    }

    addSuit(alias, queryMaker, count) {
      this.suits.push({alias: alias, queryMaker: queryMaker, count: count, timeFrames: [], errors: []});
    }

    write() {
      let message = '';
      let errors = '';
      this.suits.map((suit)=> {
        let timeTotal = suit.timeFrames.reduce(function(sum, value) {
            return sum + value[0] * 1e9 + value[1];
          }, 0) / 1e9;
        let avgTime = timeTotal / suit.timeFrames.length;
        message = message + `${avgTime * 1000} | `;
        errors = errors + `${suit.errors.length / (suit.timeFrames.length + suit.errors.length)} | `;
      });
      this.logger.warn(message);
      this.logger.warn(errors);
    }
  }

  return new Reporter(db, logger, EventEmitter);
};

exports['@singleton'] = true;
exports['@require'] = ['db', 'logger', 'events'];
