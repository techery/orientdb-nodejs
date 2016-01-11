'use strict';

var IoC = require('electrolyte');

IoC.use(IoC.node_modules('bunyan'));
IoC.use(IoC.node_modules('orientjs'));
IoC.use(IoC.node('app/services'));
IoC.use(IoC.node('app/core'));
IoC.use(IoC.node('app/workers'));

module.exports = IoC;
