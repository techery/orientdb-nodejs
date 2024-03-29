'use strict';

let chunk_20_1000 = require('./chunk_20_1000.json');

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
        'addFriend'
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
                '${generator({count: 2, units: 'sentences'})}',
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

    addFriend(chunk){
      return `SELECT addFriend('#12:${getRandomInt(100000, 110000)}', '#12:${getRandomInt(110001, 120000)}')`;
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
    case '20_1000':
      console.log(chunk);
      userId = chunk_20_1000[Math.floor(Math.random()*chunk_20_1000.length)];
      break;
    default:
      userId = getRandomInt(1, 1);
  }
  return `12:${userId}`;
}
