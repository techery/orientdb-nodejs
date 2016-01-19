'use strict';

exports = module.exports = function(db) {
  function Repository(name, clusterId) {
    this.db = db;
    this.name = name;
    this.clusterId = clusterId;
  };

  Repository.prototype.count = function() {
    return this.db.query(`SELECT count(*) FROM ${this.name}`);
  };

  Repository.prototype.getRandomRecord = function(min, max) {
    let id = getRandomInt(min, max);
    //let query = `SELECT FROM ${this.name} WHERE @rid > #${this.clusterId}:${id} LIMIT 1`;
    let query = `select expand(both('FriendsWith')) from #${this.clusterId}:${id}`;
    return this.db.query(query);
  };

  Repository.prototype.make = function(record) {
    return this.db.query(`CREATE VERTEX ${this.name} CONTENT ${JSON.stringify(record)}`);
  };

  return Repository;
};

exports['@require'] = ['db'];

/**
 * Returns a random integer between min (included) and max (included)
 * Using Math.round() will give you a non-uniform distribution!
 *
 * @param {int} min
 * @param {int} max
 * @returns int
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
