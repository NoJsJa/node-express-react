const createError = require('http-errors');
const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const execFile = require('child_process').execFile;

/* main code path define */
require('./website/app/inspector/path-locator.js')();

/* variable */
let Mongoose;  // mongoose connection

/* middleware */
const { ModuleLoader } = require('./website/utils/ModuleLoader.js');  // 模块加载器
const SessionStore = ModuleLoader('middleware', 'SessionStore.js');

/* inspector */
const lang = ModuleLoader('lang', 'index.js');  // inspector lang
const conflict = ModuleLoader('inspector', 'conflict.js');  //inspector confict
const Mock = ModuleLoader('mock', 'index.js');

/* router */
const indexRouter = ModuleLoader('controller', 'index.controller.js');  // index router
const accessRouter = ModuleLoader('controller', 'access.controller.js');  // access controller

/* env condition */
const isMockAvailable = process.argv.indexOf('mock') !== -1;  // going to use mock routers
const isMongoAvailable = process.argv.indexOf('mongo-session') !== -1;  // going to use mongo-session
const isEnvDev = process.env.NODE_ENV === 'development';  // NODE_ENV -- development
const isEnvProd = process.env.NODE_ENV === 'production';  // NODE_ENV -- production

/* view engine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/* ************************* middleware ************************* */

/* console logger */
app.use(logger('dev'));
/* json parser */
app.use(express.json());
/* url parser */
app.use(express.urlencoded({ extended: false }));
/* cookie parser */
app.use(cookieParser());
/* session store */
Mongoose = SessionStore(isMongoAvailable, app);


/* *************** predefined router/inspector in order *************** */

/* ------------------- [01] language inspector ------------------- */
app.use(lang);

/* ------------------- [02] mock inspector ------------------- */
Mock(isMockAvailable, app);

/* ------------------- [03] index router ------------------- */
app.use('/', indexRouter);

/* ------------------- [04] static resource ------------------- */
app.use( express.static(path.join(__dirname, 'public/dist')) );  // webpack auto
app.use( express.static(path.join(__dirname, 'public/public')) );  // self

/* ------------------- [05] conflict inspector ------------------- */
app.use('/', conflict);


/* *************** import other router/inspector below  *************** */

/* ------------------- router ------------------- */
app.use('/', accessRouter);

/* ------------------- inspector ------------------- */


/* error handlor */
app.use(function(req, res, next) {
  next(createError(500));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (req.method.toUpperCase() === 'GET') {
    res.status(err.status || 500);
    res.render('error');
  }else {
    res.status(500).json({
      code: 500,
      result: 'Unexpected Error!'
    });
  }
});


/* ------------------- Process Listener ------------------- */
const processKill = function () {
  console.log('kill');
  // auto close connection when in production mode
  if (Mongoose && isEnvProd) {

    Mongoose.connection.close(function () {

      console.log('------- mongoose disconnected -------');
      // child process -- stop mongodb
      execFile('scripts/db-stop.sh', function(error, stdout, stderr) {
        if (error) {
          console.log(`------- error in db.stop.sh -------`);
          console.error(error);
        }else {
          console.log('------- mongodb disconnected -------');
        }
        process.exit(0);
      });
    });
  }else {
    process.exit(0);
  }
}

process.on('SIGINT', processKill);
process.on('SIGTERM', processKill);

module.exports = app;
