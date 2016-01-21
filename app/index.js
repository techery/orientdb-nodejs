'use strict';

require('dotenv').load();
process.exit();

var IoC = require('./ioc');
var cluster = IoC.create('cluster');
if (cluster.isMaster) {
  IoC.create('master');
} else {
  IoC.create('slave');
}
