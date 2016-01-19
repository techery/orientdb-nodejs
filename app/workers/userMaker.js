'use strict';

exports = module.exports = function(users, logger) {
  function UserMaker() {
  }

  UserMaker.prototype.run = () => {
    return users.make({name: 'TestUser123'})
      .then((result) => {
        logger.info('Created User: ', result);
      })
      .catch((error) => {
        logger.error(error);
      });
  };

  UserMaker.prototype.end = function() {
    users.db.close();
    process.exit();
  };

  return new UserMaker();
};

exports['@require'] = ['users', 'logger'];
