/**
* @name: mock manager
* @description: mock数据模块管理
*/

const fs = require('fs');
const path = require('path');

const mock = function (isMockAvailable, app) {
  
  if (!isMockAvailable) return;

  console.log('------- mock router available -------');
  // 中间件必须同步载入
  const files = fs.readdirSync(__dirname);
  files.forEach(function (file) {
    if (file !== 'index.js') {
      app.use('/', require(path.resolve(__dirname, file)));
    }
  })
};


module.exports = mock;
