'use strict';

var IoC = require('../../app/ioc');
var _this = IoC.create('logger');

describe('Test logger service', function () {
    it('It return bunyan', function () {
        let Bunyan = require('bunyan');
        _this.should.be.instanceof(Bunyan);
    });
});
