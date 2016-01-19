'use strict';

var IoC = require('../../app/ioc');
var _this = IoC.create('settings');

describe('Test settings service', function () {
  it('It has correct instance', function () {
    _this.should.be.Array;
  });
  it('It has property about env', function () {
    _this.should.have.property('appName');
    _this.should.have.property('environment');
    _this.should.have.property('port');
  });
  it('It has property about workers', function () {
    _this.should.have.property('workerCount');
    _this.should.have.property('intervalOfWorkerCheck');
    _this.should.have.property('userPerWorker');
  });
  it('It has property about database', function () {
    _this.should.have.property('dbName');
    _this.should.have.property('dbParams');
    _this.dbParams.should.have.property('host');
    _this.dbParams.should.have.property('port');
    _this.dbParams.should.have.property('username');
    _this.dbParams.should.have.property('password');
  });
  it('It has property about node', function () {
    _this.should.have.property('node');
    _this.node.should.have.property('id');
    _this.node.should.have.property('count');
    _this.node.should.have.property('minUserCount');
  });

  it('It has property about user info', function () {
    _this.should.have.property('userInfo');
    _this.userInfo.should.have.property('itemPerFeed');
    _this.userInfo.should.have.property('chanceLike');
    _this.userInfo.should.have.property('chanceRead');
    _this.userInfo.should.have.property('chanceComment');
    _this.userInfo.should.have.property('activityChanceRemoveFriendship');
    _this.userInfo.should.have.property('activityChanceNewFriendship');
    _this.userInfo.should.have.property('activityChanceWritePost');
    _this.userInfo.should.have.property('activityChanceNothing');
    _this.userInfo.should.have.property('timeoutActivity');
  });
});
