'use strict';

require('dotenv').load();

var IoC = require('./ioc');

var users = IoC.create('users');

users.count().then(
    (result) => {
        console.log(result);
        users.db.close();
        process.exit();
    });
