'use strict';

var IoC = require('../../app/ioc');
var _this = IoC.create('cluster');

describe('Test core: cluster', function () {
    it('It has correct instance', function () {
        _this.should.be.instanceof(require('events'));
    });
});
