'use strict';
exports = module.exports = function (users, logger, settings) {
    var pool;
    var isInitiated = false;
    var currentRequests = 0;

    function User() {
    }

    User.prototype.init = () => {
        return users.count(settings.dbClassName).then((result) => {
            let step = Math.floor(result[0].count / settings.node.count);
            pool = {
                min: 1 + step * settings.node.id,
                max: 1 + step * (settings.node.id + 1)
            };
            isInitiated = true;
        });
    };

    User.prototype.run = () => {
        if (!isInitiated) return;

        if(currentRequests < settings.userPerWorker)
        {
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
        return users.getRandomRecord(pool.min, pool.max)
            .then((result) => {
                currentRequests--;
                process.send({type: 'request'});
            })
            .catch((error) => {
                currentRequests--;
                process.send({type: 'error'});
                logger.error(error);
            });
    }
};

exports['@require'] = ['users', 'logger', 'settings'];
