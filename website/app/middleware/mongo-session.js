/**
* @name: mongo-session
* @description: session持久化
*/

const format = require('util').format;
const path = require('path');
const settings = require(path.resolve(__dirname, '../../system/mongo.config.js'));  // mongo setting
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

function MongoSession(app) {

    console.log('>>> mongo-session is working... ');

    app.use(session({
            secret: settings.cookieSecret,
            key:settings.db,
            cookie:{
                maxAge:1000*60*60, // 1h
                secure: false
            },
            store: new MongoStore(
                {
                  url:format("mongodb://%s:%s@%s:%s/%s",
                      settings.user,
                      settings.password,
                      settings.host,
                      settings.port,
                      settings.db
                  )
                                    }
            ),
            resave: false,
            saveUninitialized: true
        }
    ));
}

module.exports = MongoSession;
