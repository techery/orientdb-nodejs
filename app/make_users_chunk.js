'use strict';

require('dotenv').load();

var IoC = require('./ioc');
var fs = require('fs');


let db = IoC.create('db');
let friendCountMin = 20;
let friendCountMax = 1000;

let postCountMin = 50;
let postCountMax = 1000;
let userCount = 100000;
let fileName = `app/repositories/chunk_${friendCountMin}_${friendCountMax}.json`;

let query = `SELECT r
  FROM
  (
    SELECT @rid as r, both('FriendsWith').size() AS sizef, out('HasPost').size() AS sizep
    FROM
    WVUser WHERE @rid > #12:1
  )

  WHERE
    sizef >= ${friendCountMin} AND sizef <= ${friendCountMax} AND
    sizep >= ${postCountMin} AND sizep <= ${postCountMax}
  LIMIT ${userCount}`;


console.log(query);

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
