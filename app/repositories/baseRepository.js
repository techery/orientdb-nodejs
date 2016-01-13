'use strict';

exports = module.exports = function (db) {
    function Repository(name) {
        this.db = db;
        this.name = name;
    };

    Repository.prototype.count = function () {
        return this.db.query(`SELECT count(*) FROM ${this.name}`);
    };

    Repository.prototype.getRandomRecord = function (min, max) {
        return this.db.query(`SELECT FROM ${this.name} SKIP ${getRandomInt(min, max)} LIMIT 1`);
    };

    Repository.prototype.make = function (record) {
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
