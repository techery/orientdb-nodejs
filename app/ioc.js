'use strict';

var IoC = require('electrolyte');

IoC.use(IoC.node_modules('bunyan'));
IoC.use(IoC.node_modules('orientjs'));
IoC.use(IoC.node_modules('datadog-metrics'));
IoC.use(IoC.node_modules('os'));
IoC.use(IoC.node_modules('events'));
IoC.use(IoC.node_modules('lorem-ipsum'));
IoC.use(IoC.node('app/services'));
IoC.use(IoC.node('app/core'));
IoC.use(IoC.node('app/workers'));
IoC.use(IoC.node('app/repositories'));

module.exports = IoC;
