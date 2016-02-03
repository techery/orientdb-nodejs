'use strict';

let chunk_100 = require('./chunk_100.json');
let chunk_80_150 = require('./chunk_80_150.json');

exports = module.exports = function(db, generator) {
  class randomRepository {
    constructor(db) {
      this.db = db;
      this.knownQueryTypes = [
        'createPost',
        'updatePost',
        'getUserPosts',
        'getUserFriends',
        'getUserFriendPosts',
      ];
    }

    query(queryType, chunk) {
      let currentQuery = this[queryType](chunk);
      return this.db.query(currentQuery).then(() => queryType);
    }

    createPost(chunk) {
      return `select createPost(
                ${getRandomUser(chunk)},
                ${getRandomInt(10000, 9999999)},
                '${generator({count: 1, units: 'sentences'})}',
                '${generator({count: 5, units: 'sentences'})}',
                '${generator({count: 1, units: 'words'})}',
                '${new Date().toISOString().replace('T', ' ').substr(0, 19)}'
            )`;
    }

    updatePost(chunk) {
      return `UPDATE Post SET short_description='Updated' WHERE @rid = #32:${getRandomInt(1, 60000000)}`;
    }

    getUserInfo(chunk) {
      return `SELECT FROM ${getRandomUser(chunk)}`;
    }

    getUserPosts(chunk) {
      return `SELECT expand(out('HasPost')) FROM ${getRandomUser(chunk)} ORDER BY created_at DESC LIMIT 50`;
    }

    getUserFriends(chunk) {
      return `SELECT expand(both('FriendsWith')) FROM ${getRandomUser(chunk)} LIMIT 100`;
    }

    getUserFriendPosts(chunk) {
      return `SELECT expand(both('FriendsWith').out('HasPost')) FROM ${getRandomUser(chunk)} ORDER BY created_at DESC LIMIT 50`;
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

function getRandomUser(chunk) {
  let userId;
  switch(chunk) {
    case '100':
      userId = chunk_100[Math.floor(Math.random()*chunk_100.length)];
      break;
    case '80_150':
      userId = chunk_80_150[Math.floor(Math.random()*chunk_80_150.length)];
      break;
    default:
      userId = getRandomInt(1, 600000);
  }
  return `12:${userId}`;
}
