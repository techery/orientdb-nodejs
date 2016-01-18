'use strict';

var IoC = require('../../app/ioc');
var _this = IoC.create('logger');

describe('Test logger service', function () {
    it('It has correct instance', function () {
        _this.should.be.instanceof(require('bunyan'));
    });
});
