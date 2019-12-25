const fileStreamRotator = require('file-stream-rotator')
const path = require('path');

const logDirectory = path.resolve(_path.public, 'logs');

module.exports = fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: '1h',
  verbose: false,
  max_logs: '10d'
});