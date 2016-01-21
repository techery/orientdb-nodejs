// single graph board creation

var request = require('request');

var api_key = '5a745555c4564194a7bece51d619a033';
var app_key = 'dc75b921fdf6d0cfbf9f3fd80b0ba5598e6615ae';

// EXAMPLE CREATE - add board with 1 graph and several requests

function createBoard() {
  var createBoard = {
    "graphs": [{
      "title": "Average Memory Free",
      "definition": {
        "events": [],
        "requests": [  // add as many metrics as you want; possible few metrics in one request
          {
            "q": "avg:system.load.1{host:techery-orientdb}",
            "type": "line",
            "conditional_formats": []
          },
          {
            "q": "avg:system.load.15{host:techery-orientdb}, sum:system.load.5{host:techery-orientdb}",
            "type": "line"
          }
        ]
      },
      "viz": "timeseries"
    }],
    "title": "Average Memory Free Shell",
    "description": "A dashboard with memory info.",
    "template_variables": [{
      "name": "host1",
      "prefix": "host",
      "default": "host:my-host"
    }]
  };

  request.post({
      url: `https://app.datadoghq.com/api/v1/dash?api_key=${api_key}&application_key=${app_key}`,
      json: createBoard,
      headers: {'Content-type': 'application/json'}
    })
    .on('response', function (response) {
      console.log(response);
      console.log(response.statusCode);

    });
}

//createBoard();


// EXAMPLE UPDATE - add several graphs

function updateBoard(boardId) {

// for update use previous board setup - remove or add new data

  var updateBoard = {
    "graphs": [{
      "title": "Average Memory Free Updated",
      "definition": {
        "events": [],
        "requests": [  // add as many metrics as you want; possible few metrics in one request
          {
            "q": "avg:system.load.1{host:techery-orientdb}",
            "type": "line",
            "conditional_formats": []
          }
        ]
      },
      "viz": "timeseries"
    }, {
      "title": "Average Memory Free",
      "definition": {
        "events": [],
        "requests": [  // add as many metrics as you want; possible few metrics in one request
          {
            "q": "avg:system.load.15{host:techery-orientdb}, sum:system.load.5{host:techery-orientdb}",
            "type": "line"
          }
        ]
      },
      "viz": "timeseries"
    }
    ],
    "title": "Average Memory Free Shell Updated",
    "description": "A dashboard with memory info.",
    "template_variables": [{
      "name": "host1",
      "prefix": "host",
      "default": "host:my-host"
    }]
  };

  request.put({
      url: `https://app.datadoghq.com/api/v1/dash/${boardId}?api_key=${api_key}&application_key=${app_key}`,
      json: updateBoard,
      headers: {'Content-type': 'application/json'}
    })
    .on('response', function (response) {
      console.log(response);
      console.log(response.statusCode);

    });
}

updateBoard(93227);
