const path = require('path');
const fs = require('fs');

/**
 * [ReadDirsString 给定目标路径将目标路径下的文件夹生成指定格式的路径map]
 * @param       {[String]} target  [相对或绝对路径]
 * @return      {[Object]} pathMap [路径map对象]
 */

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


function ReadDirsString(target) {
  const base = path.resolve(target);
  const pathMap = {};
  const readDir = function (dir, parent) {
    if (fs.statSync(path.join(parent || '', dir)).isDirectory()) {
      fs.readdirSync(path.join(parent || '', dir), { withFileTypes: true }).forEach(function (_dir) {
        readDir(_dir, path.join(parent || '', dir));
      });
    } else {
      pathMap[parent.replace(base, '').split(path.sep).filter(p => p).join('.')] = parent;
    }
  };
  readDir(base);

  return pathMap;
}

module.exports = ReadDirsString;
