/**
* @name: ModuleLoader
* @description: 文件模块加载器
*/

const path = require('path');

/**
 * [ModuleLoader]
 * @param       {[String]} path [模块所在的文件夹名 - 需要预先在path-locator里面添加]
 * @param       {[String]} name [模块文件名]
 * @constructor
 */
const ModuleLoader = function(dir, name) {
  return require(path.resolve(_path[dir], name));
}

global.ModuleLoader = ModuleLoader;

exports.ModuleLoader = ModuleLoader;
