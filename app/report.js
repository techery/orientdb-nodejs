'use strict';
require('dotenv').load();

var IoC = require('./ioc');
var reporter = IoC.create('reporter');

reporter.addSuit('easyTest', () => `SELECT FROM #12:0`, 3);
reporter.addSuit('easyTest2', () => `SELECT FROM #12:1`, 3);
reporter.run().then((r) => {
  process.exit();
});
