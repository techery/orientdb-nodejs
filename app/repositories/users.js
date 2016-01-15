'use strict';

exports = module.exports = function (baseRepository) {
    return new baseRepository('WVUser', 12);
};

exports['@require'] = ['baseRepository'];
