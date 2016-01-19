'use strict';

exports = module.exports = function(db, generator) {
  function Repository(name, cluster_id) {
    this.db = db;
    this.name = name;
    this.clusterId = cluster_id;
  };

  Repository.prototype.createRandom = function(userRid) {
    return this.db
      .query(`select createPost(
                #12:${userRid},
                ${getRandomInt(10000, 9999999)},
                '${generator({count: 1, units: 'sentences'})}',
                '${generator({count: 5, units: 'sentences'})}',
                '${generator({count: 1, units: 'words'})}',
                '${new Date().toISOString().replace('T', ' ').substr(0, 19)}'
            )`);
  };

  Repository.prototype.createRandomNew = function(userRid) {
    return this.db
      .let('post', function(s) {
        s
          .create('VERTEX', 'POST')
          .set({
            externalID: getRandomInt(10000, 9999999),
            short_description: generator({count: 1, units: 'sentences'}),
            full_description: generator({count: 5, units: 'sentences'}),
            image: generator({count: 1, units: 'words'}),
          });
      })
      .let('user', function(s) {
        s
          .select()
          .from(`#12:${userRid}`)
      })
      .let('edge', function(s) {
        s
          .create('EDGE', 'HasPost')
          .from('$user')
          .to('$post');
      })
      .return('[$post,$edge]')
      .commit()
      .all();
  };

  return new Repository('post', 32);
};

exports['@require'] = ['db', 'lorem-ipsum'];
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
