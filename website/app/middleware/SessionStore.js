const path = require('path');
const session = require('express-session');  // mongo session
const execFileSync = require('child_process').execFileSync;

let MongoSession, Mongoose;

/**
 * [SessionStore session数据存储]
 * @param       {Boolean} isMongoAvailable [是否要启动mongodb存储]
 * @param       {Object}  app              [Express 实例]
 */
function SessionStore(isMongoAvailable, app) {

  if (isMongoAvailable) {  // store in mongodb

    try {
      console.log(path.resolve(__dirname, '../../../scripts/db-check.sh'));
      execFileSync(path.resolve(__dirname, '../../../scripts/db-check.sh'));  // connect mongodb if mongodb is disconnected
    } catch (err) {
      console.log('>>> An error occurred when checking mognodb status... ');
      process.exit(1);
    }

    Mongoose = require(path.resolve(__dirname, '../../utils/MongoConnnect.js'));  // init mongodb when import
    MongoSession = require(path.resolve(__dirname, 'mongo-session.js'));  // store session in mongodb
    MongoSession(app);

  } else {  // store in memory

    const sess =  {
      secret: 'infinity',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3600000 }
    };

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1) // trust first proxy
    }
    app.use(session(sess));

  }

  return Mongoose;
}

module.exports = SessionStore;
