'use strict';

exports = module.exports = function(OrientDB, settings) {
  let server = OrientDB(settings.dbParams);
  return server.use(settings.dbName);
};

exports['@singleton'] = true;
exports['@require'] = ['orientjs', 'settings'];
