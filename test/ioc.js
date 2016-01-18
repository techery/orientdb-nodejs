'use strict';

var _this = require('../app/ioc');
describe('Test IoC', function () {
    it('It has correct instance', function () {
        _this.should.be.instanceof(require('electrolyte/lib/container'));
    });
});
