'use strict';
require('dotenv').load();

var IoC = require('./ioc');
var reporter = IoC.create('reporter');

var iterations = 100;

reporter.addSuit('getUserPosts', () => `SELECT expand(out('HasPost')) FROM ${getRandomUser()} ORDER BY created_at DESC LIMIT 50`, iterations);
reporter.addSuit('getUserFriends', () => `SELECT expand(both('FriendsWith')) FROM ${getRandomUser()} LIMIT 100`, iterations);
reporter.addSuit('getUserFriendPosts', () => `SELECT expand(both('FriendsWith').out('HasPost')) FROM ${getRandomUser()} ORDER BY created_at DESC LIMIT 50`, iterations);

reporter.addSuit('deletePost', () => `DELETE Vertex Post WHERE @rid = ${getRandomPost}`, iterations);
reporter.addSuit('updatePost', () => `UPDATE Post SET short_description='Luca' WHERE @rid = ${getRandomPost}`, iterations);

reporter.run().then((r) => {
  process.exit();
});

function getRandomPost(){
  return `#32:${getRandomInt(1, 40000000)}`;
}


function getRandomUser() {
  return `#12:${getRandomInt(1, 500000)}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
