'use strict';

var IoC = require('../../app/ioc');
var _this = IoC.create('settings');

describe('Test settings service', function () {
    it('It return array', function () {
        _this.should.be.Array;
    });
    it('It has property about env', function () {
        _this.should.have.property('appName');
        _this.should.have.property('environment');
        _this.should.have.property('port');
    });
    it('It has property about workers', function () {
        _this.should.be.Array;
        _this.should.have.property('workerCount');
        _this.should.have.property('intervalOfWorkerCheck');
    });
    it('It has property about database', function () {
        _this.should.be.Array;
        _this.should.have.property('dbName');
        _this.should.have.property('dbParams');
        _this.should.have.property('dbClassName');
        _this.dbParams.should.have.property('host');
        _this.dbParams.should.have.property('port');
        _this.dbParams.should.have.property('username');
        _this.dbParams.should.have.property('password');
    });
});
