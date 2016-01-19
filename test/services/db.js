'use strict';

var IoC = require('../../app/ioc');
var _this = IoC.create('db');

describe('Test db service', function () {
  it('It has correct instance', function () {
    _this.should.be.instanceof(require('orientjs/lib/db'));
  });
});
