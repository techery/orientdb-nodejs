'use strict';

var _this = require('../app/ioc');

describe('Test IoC', function () {
    it('It return electrolyte', function () {
        let Container = require('electrolyte/lib/container');
        _this.should.be.instanceof(Container);
    });
});
