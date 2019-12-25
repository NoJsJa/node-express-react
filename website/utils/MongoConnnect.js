/** 注:
 * 全局共享一个mongoose
 * 使用mongoose连接池不用每次都关闭
 * 只在程序结束的时候关闭连接
 * */

const path = require('path');
const mongoose = require('mongoose');
const mongoConfig = require(path.resolve(__dirname, '../system/mongo.config.js'));  // mongo config

mongoose.Promise = global.Promise;

// open db connection
mongoose.connect(mongoConfig.connectionString,
    mongoConfig.options, function (err, res) {
    console.log(`>>> connected: ${mongoConfig.connectionString}...`);

    err && console.log(`>>> [mongoose log] Error connecting to: ${mongoConfig.connectionString} . ${err}`);
});

module.exports = mongoose;
