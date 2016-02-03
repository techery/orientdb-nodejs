'use strict';

require('dotenv').load();

var IoC = require('./ioc');
var fs = require('fs');


let db = IoC.create('db');
let friendCountMin = 100;
let friendCountMax = 105;
let userCount = 1000;
let fileName = 'app/repositories/chunk_100.json';

let query = `select r, size from
 (select @rid as r, both('FriendsWith').size() AS size from WVUser WHERE @rid > #12:2)
  WHERE size >= ${friendCountMin} ORDER BY r ASC LIMIT ${userCount}`;

db.query(query).then((result) => {
  let users = [];
  result.forEach((element, index, array)=> {
    //users.push({id: element.r.position, friendCoutn: element.size});
    users.push(element.r.position);
  });
  fs.writeFile(fileName, JSON.stringify(users), function(err) {
    if (err) throw err;
    console.log('file saved');
    process.exit();
  });
}).catch((e) => console.log(e));
