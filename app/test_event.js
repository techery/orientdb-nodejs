'use strict';
var dogapi = require('dogapi');
const options = {
  api_key: '5a745555c4564194a7bece51d619a033',
  app_key: '257eaa2e568849f86ac765137411959df31ec6b8',
};

dogapi.initialize(options);

var title = 'some new event';
var text = 'IT HAPPENED!';
dogapi.event.create(title, text, function(err, res) {
  console.dir(res);
});
title = 'another event';
text = 'IT HAPPENED AGAIN!';
var properties = {
  tags: ['some:tag'],
  alert_type: 'error',
};
dogapi.event.create(title, text, properties, function(err, res) {
  console.dir(res);
});
