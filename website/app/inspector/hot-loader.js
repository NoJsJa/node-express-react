const fs = require("fs");      //文件系统模块
const path = require("path");

function cleanCache(modulePath) {
    var module = require.cache[modulePath];
    if (!module) {
        return;
    }

    if (module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
      require.cache[modulePath] = null;
}

const watchFile = function (filepath) {
    const fullpath = path.resolve(__dirname, '../../../', filepath);
    fs.watch(fullpath,function(event,filename){
        if (event === "change") {
            cleanCache(fullpath);
            try {
                const routes = require(fullpath);
                console.log(">>> reload module... ", filename);
            } catch (ex) {
                console.log('>>> module update failed... ');
                console.error(ex);
            }
        }
    });
};

module.exports = function (files) {
  files.length && files.forEach(function (file, i) {
    watchFile(file);
  });
};
