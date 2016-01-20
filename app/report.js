'use strict';
require('dotenv').load();

var IoC = require('./ioc');
var reporter = IoC.create('reporter');

reporter.addSuit('easyTest', () => `SELECT FROM #12:0`, 10);
reporter.addSuit('easyTest2', () => `SELECT FROM #12:1`, 10);
reporter.run().then((r) => console.log(r));
