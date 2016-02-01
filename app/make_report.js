'use strict';
var dogapi = require('dogapi');
const options = {
  api_key: '5a745555c4564194a7bece51d619a033',
  app_key: '257eaa2e568849f86ac765137411959df31ec6b8',
};
let queries = ['createPost', 'updatePost', 'getUserInfo', 'getUserPosts', 'getUserFriends', 'getUserFriendPosts'];

dogapi.initialize(options);

let now = parseInt(new Date().getTime() / 1000);
let then = now - 60 * 60 * 24 * 5;
let callbackCount;
let parameters = {
  tags: "environment:test",
  priority: 'normal'
};
let reports = [];

dogapi.event.query(then, now, parameters, function(err, res) {

  res.events.sort((a, b) => {
    if (a.date_happened < b.date_happened)
      return -1;
    else if (a.date_happened > b.date_happened)
      return 1;
    else
      return 0;
  });

  while (res.events.length > 0) {
    let start = res.events.shift();
    if (start.title !== 'Apache benchmark start') {
      continue;
    }
    let end = res.events.shift();
    if (!end || end.title !== 'Apache benchmark end') {
      continue;
    }
    if (end.text === start.text) {
      reports.push({start: start.date_happened - 5, end: end.date_happened + 5, url: start.text});
    }
  }

  callbackCount = reports.length * queries.length * 2;
  for (let i = 0; i < reports.length; i++) {
    for (let currentQueryId = 0; currentQueryId < queries.length; currentQueryId++) {
      reports[i][queries[currentQueryId]] = {};
      //saveCounts(i, queries[currentQueryId], 'sum', 'done');
      saveCounts(i, queries[currentQueryId], 'min', 'min');
      saveCounts(i, queries[currentQueryId], 'max', 'max');
      //saveCounts(i, queries[currentQueryId], 'avg', 'avg');
    }
  }
});


function saveCounts(i, queryType, prefix, postfix) {
  const query = `${prefix}:orientDB_perfomance.${queryType}.${postfix}{*}`;
  dogapi.metric.query(reports[i].start, reports[i].end, query, function(err, res) {
    if (err) {
      console.log(err);
      return writeReports();
    }
    if (res.series === undefined || res.series.length === 0) {
      reports[i][queryType][postfix] = [];
      return writeReports();
    }
    reports[i][queryType][postfix] = res.series[0].pointlist;
    return writeReports();
  });
}

function writeReports() {
  callbackCount--;
  if (callbackCount === 0) {
    console.dir(reports);
    process.exit();
  }
}

setTimeout(() => {
  console.log('Too long time');
  process.exit();
}, 10000);
