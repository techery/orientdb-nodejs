'use strict';
require('dotenv').load();

var IoC = require('./ioc');
var reporter = IoC.create('reporter');

var iterations = 25;

var randomUsers = [ '#12:157708',
  '#12:17666',
  '#12:490128',
  '#12:367269',
  '#12:401046',
  '#12:336437',
  '#12:4726',
  '#12:240957',
  '#12:357535',
  '#12:308505',
  '#12:392977',
  '#12:421485',
  '#12:361351',
  '#12:137169',
  '#12:116841',
  '#12:100696',
  '#12:22416',
  '#12:35507',
  '#12:63463',
  '#12:217076',
  '#12:317202',
  '#12:170439',
  '#12:495059',
  '#12:409317',
  '#12:484451' ];

reporter.addSuit('getUserPosts', (i) => `SELECT expand(out('HasPost')) FROM ${getRandomUser(i)} ORDER BY created_at DESC LIMIT 50`, iterations);
reporter.addSuit('getUserFriends', (i) => `SELECT expand(both('FriendsWith')) FROM ${getRandomUser(i)} LIMIT 100`, iterations);
reporter.addSuit('getUserFriendPosts', (i) => `SELECT expand(both('FriendsWith').out('HasPost')) FROM ${getRandomUser(i)} ORDER BY created_at DESC LIMIT 50`, iterations);

reporter.addSuit('deletePost', (i) => `DELETE Vertex Post WHERE @rid = ${getRandomPost()}`, iterations);
reporter.addSuit('updatePost', (i) => `UPDATE Post SET short_description='Luca' WHERE @rid = ${getRandomPost()}`, iterations);

reporter.run().then((r) => {
  process.exit();
});

function getRandomPost(){
  return `#32:${getRandomInt(1, 40000000)}`;
}


function getRandomUser(i) {
  return randomUsers[i];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
