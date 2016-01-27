'use strict';
var dogapi = require("dogapi");
const options = {
  api_key: '5a745555c4564194a7bece51d619a033',
  app_key: 'dc75b921fdf6d0cfbf9f3fd80b0ba5598e6615ae',
};
const timeboardID = '94419';
dogapi.initialize(options);
const title = 'OrientDB perfomance test';
//const description = `Made at ${new Date().toLocaleDateString('en-US')}`;
const description = `Made at `;
let graphs = [
  {
    definition: {
      events: [],
      requests: [
        {q: "avg:system.mem.free{*}"}
      ],
      viz: "timeseries"
    },
    title: "Average Memory Free"
  }
];

let templateVariables = [
  {
    name: "host1",
    prefix: "host",
    default: "host:my-host"
  }
];
dogapi.timeboard.update(
  timeboardID, title, description, graphs, templateVariables,
  function(err, res) {
    console.log(`err ${err}`);
    console.log(`res ${res}`);
  }
);
