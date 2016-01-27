'use strict';

exports = module.exports = function(db, generator) {
  class randomRepository {
    constructor(db) {
      this.db = db;
    }

    query(queryType) {
      let currentQuery = this[queryType]();
      return this.db.query(currentQuery).then(() => queryType);
    }

    makeQueryType() {
      let chance = Math.random();
      if (chance <= 0.01) return 'createPost';
      if (chance <= 0.02) return 'updatePost';
      if (chance <= 0.05) return 'getUserInfo';
      if (chance <= 0.15) return 'getUserPosts';
      if (chance <= 0.25) return 'getUserFriends';
      return 'getUserFriendPosts';
    }

    createPost() {
      return `select createPost(
                #12:${getRandomInt(1, 600000)},
                ${getRandomInt(10000, 9999999)},
                '${generator({count: 1, units: 'sentences'})}',
                '${generator({count: 5, units: 'sentences'})}',
                '${generator({count: 1, units: 'words'})}',
                '${new Date().toISOString().replace('T', ' ').substr(0, 19)}'
            )`;
    }

    updatePost() {
      return `UPDATE Post SET short_description='Updated' WHERE @rid = #32:${getRandomInt(1, 60000000)}`;
    }

    getUserInfo() {
      return `SELECT FROM 12:${getRandomInt(1, 600000)}`;
    }

    getUserPosts() {
      return `SELECT expand(out('HasPost')) FROM 12:${getRandomInt(1, 600000)} ORDER BY created_at DESC LIMIT 50`;
    }

    getUserFriends() {
      return `SELECT expand(both('FriendsWith')) FROM 12:${getRandomInt(1, 600000)} LIMIT 100`;
    }

    getUserFriendPosts() {
      return `SELECT expand(both('FriendsWith').out('HasPost')) FROM 12:${getRandomInt(1, 600000)} ORDER BY created_at DESC LIMIT 50`;
    }
  }

  return new randomRepository(db);
};

exports['@require'] = ['db', 'lorem-ipsum'];

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
