'use strict';
var dogapi = require('dogapi');
var json2csv = require('json2csv');
var fs = require('fs');

const options = {
  api_key: '5a745555c4564194a7bece51d619a033',
  app_key: '257eaa2e568849f86ac765137411959df31ec6b8',
};
let queries = ['createPost', 'updatePost', 'getUserPosts', 'getUserFriends', 'getUserFriendPosts', 'allQueries'];

dogapi.initialize(options);

//let now = parseInt(new Date().getTime() / 1000) - 60 * 60 * 16 * 1 - 60 * 10;
//let then = now - 60 * 60 * 1 * 1 - 60 * 50;

// year, month (from 0), day, time
let now = parseInt(new Date(2016,1,3,0,5,0).getTime() / 1000);
let then = now - 60 * 50;

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
      reports.push({
        start: start.date_happened - 15,
        end: end.date_happened + 15,
        url: start.text,
        tags: start.tags
      });
    }
  }

  callbackCount = reports.length * queries.length * 4;
  for (let i = 0; i < reports.length; i++) {
    for (let currentQueryId = 0; currentQueryId < queries.length; currentQueryId++) {
      reports[i][queries[currentQueryId]] = {};
      saveCounts(i, queries[currentQueryId], 'sum', 'done', 'done');
      saveCounts(i, queries[currentQueryId], 'min', 'time.min', 'min');
      saveCounts(i, queries[currentQueryId], 'max', 'time.max', 'max');
      saveCounts(i, queries[currentQueryId], 'sum', 'time.avg', 'avg');
    }
  }
  if (reports.length === 0) {
    console.log('We have not cases');
    process.exit();
  }
});


function saveCounts(i, queryType, prefix, postfix, type) {
  const query = `${prefix}:orientDB_perfomance.${queryType}.${postfix}{*}`;
  dogapi.metric.query(reports[i].start, reports[i].end, query, function(err, res) {
    if (err) {
      console.log(err);
      return prepareReport();
    }
    if (res.series === undefined || res.series.length === 0) {
      reports[i][queryType][type] = [];
      return prepareReport();
    }
    reports[i][queryType][type] = res.series[0].pointlist;
    return prepareReport();
  });
}

function prepareReport() {
  callbackCount--;
  if (callbackCount === 0) {
    writeReport();
  }
}

function writeReport() {
  let result = [];
  for (let i = 0; i < reports.length; i++) {
    for (let currentQueryId = 0; currentQueryId < queries.length; currentQueryId++) {
      //cleaning empty data
      if (!reports[i][queries[currentQueryId]].done) continue;
      while (reports[i][queries[currentQueryId]].done[0][1] === 0) {
        reports[i][queries[currentQueryId]].done.shift();
        reports[i][queries[currentQueryId]].min.shift();
        reports[i][queries[currentQueryId]].max.shift();
        reports[i][queries[currentQueryId]].avg.shift();
        reports[i].start = reports[i][queries[currentQueryId]].done[0][0];
      }
      while (reports[i][queries[currentQueryId]].done[reports[i][queries[currentQueryId]].done.length - 1][1] === 0) {
        reports[i][queries[currentQueryId]].done.pop();
        reports[i][queries[currentQueryId]].min.pop();
        reports[i][queries[currentQueryId]].max.pop();
        reports[i][queries[currentQueryId]].avg.pop();
        reports[i].end--;
        reports[i].end = reports[i][queries[currentQueryId]].done[reports[i][queries[currentQueryId]].done.length - 1][0];
      }
      let params = {
        type: queries[currentQueryId],
        url: reports[i].url,
        tags: reports[i].tags,
        done: 0,
        timeSum: 0,
        min: 100,
        max: -1,
        start: reports[i].start,
        end: reports[i].end,
      };
      let step = reports[i][queries[currentQueryId]].done[1][1] - reports[i][queries[currentQueryId]].done[0][1];
      for (let timepoint = 0; timepoint < reports[i][queries[currentQueryId]].done.length; timepoint++) {
        let min = parseFloat(reports[i][queries[currentQueryId]].min[timepoint][1]);
        let max = parseFloat(reports[i][queries[currentQueryId]].max[timepoint][1]);
        let done = Math.round(parseFloat(reports[i][queries[currentQueryId]].done[timepoint][1]) * step);
        let timeAvg = parseFloat(reports[i][queries[currentQueryId]].avg[timepoint][1]);
        params.done = params.done + done;
        params.timeSum = params.timeSum + done * timeAvg;
        if (params.min > min) {
          params.min = min;
        }
        if (params.max < max) {
          params.max = max;
        }

      }
      params.avg = params.timeSum / params.done;
      result.push(params);
    }
  }
  writeCVS(result);
}

setTimeout(() => {
  console.log('Too long time');
  process.exit();
}, 30000);

function writeCVS(data) {

  let fields = ['tags[0]', 'url', 'start', 'end', 'type', 'min', 'max', 'avg', 'done'];
  json2csv({data: data, fields: fields}, function(err, csv) {
    if (err) console.log(err);
    console.log(csv);
    fs.writeFile('result.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
      process.exit();
    });
  });
}
