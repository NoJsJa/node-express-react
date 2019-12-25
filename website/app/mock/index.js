/**
* @name: mock manager
* @description: mock数据模块管理
*/

const fs = require('fs');
const path = require('path');

const mock = function (isMockAvailable, app) {

  if (!isMockAvailable) return;

  console.log('>>> mock router available... ');
  // 中间件必须同步载入
  const files = fs.readdirSync(__dirname);
  let stats;
  files.forEach(function (file) {

    if (file == 'index.js') return;
    stats = null;
    stats = fs.lstatSync( path.resolve(__dirname, file) );

    if (stats && stats.isDirectory()) {
      stats = null;

      fs.readdirSync(path.resolve(__dirname, file)).forEach(function (tfile) {

        stats = fs.lstatSync( path.resolve(__dirname, file, tfile) );
        if (stats && stats.isFile()) {
          stats = null;
          app.use('/', require( path.resolve(__dirname, file, tfile) ));
        }

      });
    }

  })
};


module.exports = mock;
