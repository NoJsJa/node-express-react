const path = require('path');
const ReadDirsString = require(path.resolve(process.cwd(), 'website/utils/ReadDirsString.js'));

/*
  Example =>
  {
    'controller': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/controller',
    'controller.hyhive': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/controller/hyhive',
    'controller.infinity': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/controller/infinity',
    'controller.ipsan': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/controller/ipsan',
    'controller.public': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/controller/public',
    'inspector': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/inspector',
    'middleware': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/middleware',
    'mock.hyhive': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/mock/hyhive',
    'mock': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/mock',
    'mock.infinity': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/mock/infinity',
    'mock.public': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/mock/public',
    'model.hyhive': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/model/hyhive',
    'model': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/model',
    'model.infinity': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/model/infinity',
    'model.public': '/mnt/e/Ubuntu18.04/github/allweb-new/allweb/node-express-react/website/app/model/public'
  }
*/


const _pathLocator = function () {
  global._path = {};
  _path.root = process.cwd();  // process path
  // _path.controller = path.resolve(_path.root, 'website/app/controller');
  // _path.model = path.resolve(_path.root, 'website/app/model');
  // _path.inspector = path.resolve(_path.root, 'website/app/inspector');
  // _path.middleware = path.resolve(_path.root, 'website/app/middleware');
  // _path.mock = path.resolve(_path.root, 'website/app/mock');
  _path.utils = path.resolve(_path.root, 'website/utils');
  _path.lang = path.resolve(_path.root, 'website/lang');
  _path.system = path.resolve(_path.root, 'website/system');
  _path.scripts = path.resolve(_path.root, 'scripts');
  _path.mongodb = path.resolve(_path.root, 'mongodb');
  _path.dist = path.resolve(_path.root, 'public/dist');
  global._path = Object.assign(_path, ReadDirsString(path.resolve(_path.root, 'website/app')));
};

module.exports = _pathLocator;
