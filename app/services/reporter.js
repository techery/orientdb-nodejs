'use strict';

exports = module.exports = function(db, logger) {

  class Reporter {
    constructor(db, logger) {
      this.db = db;
      this.logger = logger;
      this.suits = [];
    }

    run() {
      this.promise = new Promise((resolve, reject) => {
        this.promiseResolve = resolve;
        this.promiseReject = reject;

        this.loop = setInterval(this.loop)
        setTimeout(() => {
          this.write();
          resolve("result");
        }, 1000);
      });

      return this.promise;
    }

    makeQuery() {

    }

    addSuit(alias, queryMaker, count) {
      this.suits[alias] = {queryMaker: queryMaker, count: count, timeFrames: []};
    }

    write() {
      this.logger.info('Done');
    }
  }
  //
  //function Reporter() {
  //  this.suits = [];
  //  this.isRunning = false;
  //};
  //
  //Reporter.prototype.start = function() {
  //  this.isRunning = true;
  //};
  //
  //Reporter.prototype.addSuit = function(alias, queryMaker, count) {
  //  this.suits[alias] = {queryMaker: queryMaker, count: count, timeFrames: []};
  //};
  //
  //Reporter.prototype.make = function() {
  //  this.isRunning = false;
  //}
  //
  //Reporter.prototype.write = function() {
  //  logger.info('Done');
  //};

  return new Reporter(db, logger);
};

exports['@singleton'] = true;
exports['@require'] = ['db', 'logger'];
