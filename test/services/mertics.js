'use strict';

require('dotenv').load();

var IoC = require('../../app/ioc');
var _this = IoC.create('metrics');

describe('Test metrics service', function () {
    it('It has correct instance', function () {
        _this.should.be.instanceof(require('datadog-metrics/lib/loggers').BufferedMetricsLogger);
    });
});
