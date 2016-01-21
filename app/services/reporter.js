'use strict';

exports = module.exports = function(db, logger, EventEmitter) {

  class Reporter {
    constructor(db, logger, EventEmitter) {
      this.db = db;
      this.logger = logger;
      this.suits = [];
      this.currentQuery = {
        suitId: 0,
        index: 0
      };
      this.eventEmitter = new EventEmitter();
      this.eventEmitter.on('queryDone', (result, startTime) => {
        this.suits[this.currentQuery.suitId].timeFrames.push(process.hrtime(startTime));
        this.nextQuery();
      });
      this.eventEmitter.on('queryError', (error, startTime) => {
        this.suits[this.currentQuery.suitId].timeFrames.push(process.hrtime(startTime));
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
      this.db.open().then(()=>{
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
        this.currentQuery.suitId++;
        if (this.currentQuery.suitId >= this.suits.length) {
          this.write();
          return this.promise.resolve();
        }
      } else {
        this.currentQuery.index++;
      }
      let query = this.suits[this.currentQuery.suitId].queryMaker();
      let startTime = process.hrtime();
      return this.db.query(query).then((r) => {
        this.eventEmitter.emit('queryDone', r, startTime);
      }).catch((e) => {
        this.eventEmitter.emit('queryError', e, startTime);
      });
    }

    addSuit(alias, queryMaker, count) {
      this.suits.push({alias: alias, queryMaker: queryMaker, count: count, timeFrames: []});
    }

    write() {
      let message = ''
      this.suits.map((suit)=> {
        let timeTotal = suit.timeFrames.reduce(function(sum, value) {
            return sum + value[0] * 1e9 + value[1];
          }, 0) / 1e9;
        let avgTime = timeTotal / suit.timeFrames.length;
        message = message + `Query: ${suit.alias} Avg.time: ${avgTime} | `;
      });
      this.logger.warn(message);
    }
  }

  return new Reporter(db, logger, EventEmitter);
};

exports['@singleton'] = true;
exports['@require'] = ['db', 'logger', 'events'];
