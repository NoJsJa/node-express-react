const logger = require('morgan');
const accessLogStream = ModuleLoader('inspector', 'log-stream.js');

const colorMap = {
    black:30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    purple: 35,
    heavyGree: 36,
    white: 37,
}

function console_log(info, _color, _bgcolor) {
  const color = colorMap[_color];
  const bgcolor = colorMap[_bgcolor] + 10;
  const colorFormat = color && bgcolor ? `${bgcolor};${color}m` : '\033[0m';
  console.log('\033[' + `${colorFormat}${info}` + '\033[0m') ;
}

logger.token('ip', function(req, res){
  return (req.ip || '-').replace('::ffff:', '');
});

logger.format('dev', '[:status] :method 【:url】 :ip');
logger.format('prod', '[:date[clf]] :status ":method :url" :res[content-length]B [:response-time ms] :ip')

global.console_log = console_log;
module.exports = logger(isEnvDev ? 'dev': 'prod', isEnvDev ? undefined : { stream: accessLogStream });