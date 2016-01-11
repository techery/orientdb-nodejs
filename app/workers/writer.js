'use strict';

exports = module.exports = function (db, settings, logger) {
    var currentClass;

    function Writer() {
    }

    Writer.prototype.init = function () {
        return db.class.get(settings.dbClassName).then((Class) => {
            currentClass = Class;
        });
    }

    Writer.prototype.run = function () {
        return currentClass.create({name: 'TestUser123'})
            .then((result) => {
                logger.info('Created User: ', result);
            })
            .catch((error) => {
                logger.error(error);
            });
    }

    Writer.prototype.end = function () {
        db.close();
        process.exit();
    }

    return new Writer();
};

exports['@require'] = ['db', 'settings', 'logger'];

function example() {
    db.class.get(settings.dbClassName)
        .then((User) => {
            return Promise.all([User.create({
                name: 'TestUser123'
            })]);
        })
        .then((results) => {
            logger.info('Created User: ', results[0]);
        })
        .catch((error) => {
            logger.error(error);
        });
}
