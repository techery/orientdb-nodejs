'use strict';
var dogapi = require("dogapi");
const options = {
  api_key: '5a745555c4564194a7bece51d619a033',
  app_key: '257eaa2e568849f86ac765137411959df31ec6b8',
};

dogapi.initialize(options);
const title = 'OrientDB perfomance test';
const description = `Made at ${new Date().toLocaleDateString('en-US')}`;
let graphs = [];

graphs.push(
  {
    title: "Memory breakdown",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "avg:system.mem.free{host:techery-orientdb}, avg:system.mem.used{host:techery-orientdb}, avg:system.mem.cached{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "area"
        }
      ],
    }
  }
);

graphs.push(
  {
    title: "CPU usage (%)",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "avg:system.cpu.idle{host:techery-orientdb}, avg:system.cpu.system{host:techery-orientdb}, avg:system.cpu.iowait{host:techery-orientdb}, avg:system.cpu.user{host:techery-orientdb}, avg:system.cpu.stolen{host:techery-orientdb}, avg:system.cpu.guest{host:techery-orientdb}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "area"
        }
      ],
    }
  }
);

graphs.push(
  {
    title: "Apache Benchmark concurrency",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "avg:orientDB_perfomance.allQueries.processing{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "line"
        }
      ]
    }
  }
);

graphs.push(
  {
    title: "Disk latency (ms, by device)",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "max:system.io.await{host:techery-orientdb} by {device}",
          "type": "area",
          "conditional_formats": []
        }
      ],

    }
  }
);

graphs.push(
  {
    title: "system IO",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "avg:system.io.w_s{*}",
          "conditional_formats": [],
          "type": "line",
          "aggregator": "avg"
        },
        {
          "q": "avg:system.io.r_s{*}",
          "type": "line"
        }
      ]

    }
  }
);

graphs.push(
  {
    title: "JVM",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "extra_col": "",
          "change_type": "absolute",
          "order_dir": "desc",
          "compare_to": "hour_before",
          "conditional_formats": [],
          "q": "avg:jvm.heap_memory{host:techery-orientdb}",
          "increase_good": true,
          "aggregator": "avg",
          "order_by": "change",
          "type": "line"
        },
        {
          "extra_col": "",
          "change_type": "absolute",
          "order_dir": "desc",
          "compare_to": "hour_before",
          "conditional_formats": [],
          "q": "avg:jvm.heap_memory_committed{host:techery-orientdb}",
          "increase_good": true,
          "order_by": "change",
          "type": "line"
        },
        {
          "extra_col": "",
          "change_type": "absolute",
          "order_dir": "desc",
          "compare_to": "hour_before",
          "conditional_formats": [],
          "q": "avg:jvm.heap_memory_max{host:techery-orientdb}",
          "increase_good": true,
          "order_by": "change",
          "type": "line"
        },
        {
          "extra_col": "",
          "change_type": "absolute",
          "order_dir": "desc",
          "compare_to": "hour_before",
          "conditional_formats": [],
          "q": "avg:jvm.heap_memory_init{host:techery-orientdb}",
          "increase_good": true,
          "order_by": "change",
          "type": "line"
        }
      ]
    }
  }
);

graphs.push(
  {
    title: "Queries and errors per second",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "avg:orientDB_perfomance.allQueries.done{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "line"
        },
        {
          "q": "avg:orientDB_perfomance.allQueries.errors{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "line"
        }
      ]
    }
  }
);

graphs.push(
  {
    title: "Avg time for every Query",
    definition: {
      "viz": "query_value",
      "custom_unit": "s",
      "autoscale": true,
      "precision": "3",
      events: [],
      "requests": [
        {
          "q": "avg:orientDB_perfomance.allQueries.time.avg{*}",
          "aggregator": "last",
          "conditional_formats": []
        }
      ]
    }
  });

graphs.push(
  {
    title: "Time per query. Max, avg, min",
    definition: {
      "viz": "timeseries",
      events: [],
      "requests": [
        {
          "q": "avg:orientDB_perfomance.allQueries.time.avg{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "line"
        },
        {
          "q": "avg:orientDB_perfomance.allQueries.time.max{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "line"
        },
        {
          "q": "avg:orientDB_perfomance.allQueries.time.min{*}",
          "aggregator": "avg",
          "conditional_formats": [],
          "type": "line",
          "style": {
            "type": "solid"
          }
        }
      ]
    }
  });

var queries = ['createPost', 'updatePost', 'getUserInfo', 'getUserPosts', 'getUserFriends', 'getUserFriendPosts'];

for (var i = 0; i < queries.length; i++) {
  let queryType = queries[i];
  graphs.push(
    {
      title: `Counts for ${queryType}. Done, processing, errors`,
      definition: {
        "viz": "timeseries",
        events: [],
        "requests": [
          {
            "q": `avg:orientDB_perfomance.${queryType}.done{*}`,
            "aggregator": "avg",
            "conditional_formats": [],
            "type": "line"
          },
          {
            "q": `avg:orientDB_perfomance.${queryType}.processing{*}`,
            "aggregator": "avg",
            "conditional_formats": [],
            "type": "line"
          },
          {
            "q": `avg:orientDB_perfomance.${queryType}.errors{*}`,
            "aggregator": "avg",
            "conditional_formats": [],
            "type": "line"
          }
        ]
      }
    });

  graphs.push(
    {
      title: `Times for ${queryType}. Max, min, avg`,
      definition: {
        "viz": "timeseries",
        events: [],
        "requests": [
          {
            "q": `avg:orientDB_perfomance.${queryType}.time.avg{*}`,
            "aggregator": "avg",
            "conditional_formats": [],
            "type": "line"
          },
          {
            "q": `avg:orientDB_perfomance.${queryType}.time.max{*}`,
            "aggregator": "avg",
            "conditional_formats": [],
            "type": "line"
          },
          {
            "q": `avg:orientDB_perfomance.${queryType}.time.min{*}`,
            "aggregator": "avg",
            "conditional_formats": [],
            "type": "line"
          }
        ]
      }
    });
}

let templateVariables = [];
dogapi.timeboard.create(
  title, description, graphs, templateVariables,
  function(err, res) {
    console.log(`err ${err}`);
    console.log(`res ${res}`);
  }
);
