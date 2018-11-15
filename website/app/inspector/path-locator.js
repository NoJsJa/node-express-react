const path = require('path');

const _pathLocator = function () {
  global._path = {};
  _path.root = process.cwd();  // process path
  _path.controller = path.resolve(_path.root, 'website/app/controller');
  _path.model = path.resolve(_path.root, 'website/app/model');
  _path.inspector = path.resolve(_path.root, 'website/app/inspector');
  _path.middleware = path.resolve(_path.root, 'website/app/middleware');
  _path.mock = path.resolve(_path.root, 'website/app/mock');
  _path.utils = path.resolve(_path.root, 'website/utils');
  _path.lang = path.resolve(_path.root, 'website/lang');
  _path.system = path.resolve(_path.root, 'website/system');
  _path.scripts = path.resolve(_path.root, 'scripts');
  _path.mongodb = path.resolve(_path.root, 'mongodb');
  _path.dist = path.resolve(_path.root, 'public/dist');
};

module.exports = _pathLocator;
