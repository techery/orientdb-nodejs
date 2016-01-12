'use strict';

exports = module.exports = function () {
    return require('cluster');
};

exports['@singleton'] = true;
