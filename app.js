const createError = require('http-errors');
const express = require('express');
global.app = express();

const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
const indexRouter = ModuleLoader('controller.public', 'index.controller.js');  // index router
const accessRouter = ModuleLoader('controller.public', 'access.controller.js');  // access controller

/* env condition */
const isMockAvailable = process.argv.indexOf('mock') !== -1;  // going to use mock routers
let isMongoAvailable = process.argv.indexOf('mongo-session') !== -1;  // going to use mongo-session
global.isEnvDev = process.env.NODE_ENV === 'development';  // NODE_ENV -- development
const isMongoDisable = process.argv.indexOf('mongo-disable') !== -1;  // disable mongodb

isMongoAvailable = (isMongoAvailable && !isMongoDisable);  // 判断是否要通过mongo管理session

/* view engine set */
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

/* ************************* middleware ************************* */
const logger = ModuleLoader('inspector', 'log-handle.js');

/* console logger ModuleLoader*/
app.use(logger);
/* json parser */
app.use(express.json());
/* url parser */
app.use(express.urlencoded({ extended: false }));
/* cookie parser */
app.use(cookieParser());
/* body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* enable CORS  */
app.use(cors());
/* session store */
SessionStore(false, app);

/* *************** predefined router/inspector in order *************** */


/* [01] language inspector */
app.use(lang);

/* [02] mock inspector */
Mock(isMockAvailable, app);

/* [03] index router */
app.use('/', indexRouter);

/* [04] static resource */
app.use(express.static(path.join(__dirname, 'public/dist')));  // webpack dist
app.use(express.static(path.join(__dirname, 'public/public')));  // express resources

/* [05] conflict inspector */
app.use('/', conflict);

/* *************** import service router/inspector below  *************** */

/* app router */

// access
app.use('/', accessRouter);


/* *************** inspector *************** */

/* *************** middleware *************** */

/* ------------------- inspector ------------------- */

ModuleLoader('utils', 'Request.js');

/* error handlor */
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = isEnvDev ? err : {};

  if (req.method.toUpperCase() === 'GET') {
    res.status(err.status || 500);
    res.render('error');
  } else {
    res.status(404).json({
      code: 404,
      result: 'Not Found!'
    });
  }
});


/* *************** Process Listener *************** */

const processKill = function () {
  console_log('-------------------- process kill --------------------', 'red', 'black');
  process.exit(0);
  /* auto close connection when in production mode */
  // if (isMongoAvailable && Mongoose && !isEnvDev) {
    //
    //   Mongoose.connection.close(function () {
      // console.log('>>> now kill mongoose');
  //
  //     console.log('>>> mongoose disconnected... ');
  //     // child process -- stop mongodb
  //     execFile('scripts/db-stop.sh', function (error, stdout, stderr) {
  //       if (error) {
  //         console.log(`>>> error in db.stop.sh...`);
  //         console.error(error);
  //       } else {
  //         console.log('>>> mongodb disconnected... ');
  //       }
  //       process.exit(0);
  //     });
  //   });
  // } else {
  //   process.exit(0);
  // }
}

process.on('SIGINT', processKill);
process.on('SIGTERM', processKill);
process.on('uncaughtException', (err) => {
  console_log('Uncaught Error ------> ', 'red', 'white');
  console_log(err.stack);
  console_log('<------ Uncaught Error ', 'red', 'white');
});

module.exports = app;
