// init connection, promise
require('dotenv').load();
var OrientDB = require('orientjs');
var server = OrientDB({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

var db = server.use(process.env.DB_DATABASE);

// add user, display debug info, close connection
db.class.get(process.env.DB_USER_CLASS)
    .then(function (User) {
        return Promise.all([User.create({
            name: 'TestUser123'
        }),
            User.list()
        ]);
    })
    .then(function (results) {
        console.log('Created User: ', results[0]);
        server.close();
        db.close();
        process.exit();
    })
    .done();
