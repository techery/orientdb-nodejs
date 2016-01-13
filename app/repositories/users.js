'use strict';

exports = module.exports = function (baseRepository) {
    return new baseRepository('WVUser');
};

exports['@require'] = ['baseRepository'];
