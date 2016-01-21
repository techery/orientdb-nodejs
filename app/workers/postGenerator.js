'use strict';
exports = module.exports = function(users, logger, settings, posts) {
  var pool;
  var isInitiated = false;
  var currentRequests = 0;

  function User() {
  }

  User.prototype.init = () => {
    return users.count(settings.dbClassName).then((result) => {
      let step = Math.floor(result[0].count / settings.node.count);
      pool = {
        min: step * settings.node.id,
        max: 1 + step * (settings.node.id + 1)
      };
      isInitiated = true;
    });
  };

  User.prototype.run = () => {
    if (!isInitiated) {
      return;
    }

    if (pool.min >= pool.max) {
      return;
    }

    if (currentRequests < settings.userPerWorker) {
      currentRequests++;
      step();
    }
  };

  User.prototype.end = () => {
    users.db.close();
    process.exit();
  };

  return new User();

  function step() {
    pool.min++;
    let postCount = getRandomInt(1,1);
    let newPosts = [];
    for (let i = 0; i < postCount; i++) {
      newPosts.push(posts.createRandom(pool.min))
    }
    return Promise.all(newPosts)
      .then((results) => {
        currentRequests--;
        process.send({type: 'makePostsForUser'});
      })
      .catch((error) => {
        currentRequests--;
        process.send({type: 'error'});
        logger.error(error);
      });
  }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports['@require'] = ['users', 'logger', 'settings', 'posts'];
