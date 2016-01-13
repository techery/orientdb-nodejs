'use strict';
exports = module.exports = function (users, logger, settings) {
    var pool;

    function User() {
    }

    User.prototype.init = () => {
        return users.count(settings.dbClassName).then((result) => {
            let step = Math.floor(result[0].count / settings.node.count);
            pool = {
                min: 1 + step * settings.node.id,
                max: 1 + step * (settings.node.id + 1)
            }
        });
    };

    User.prototype.run = () => {
        for (var i = 0; i < settings.userPerWorker; i++) {
            endlessLoop();
        }
    };

    User.prototype.end = () => {
        users.db.close();
        process.exit();
    };

    return new User();

    function step() {
        return users.getRandomRecord(pool.min, pool.max)
            .then((result) => {
                logger.info('User: ', result);
            })
            .catch((error) => {
                logger.error(error);
            });
    }

    function endlessLoop() {
        return step().then(endlessLoop).catch((error) => {
            logger.error(error);
        });
    }
};

exports['@require'] = ['users', 'logger', 'settings'];
