const fs = require('fs');
const path = require('path');

/**
 * global.lang -- 内存里保存的所有语言数据
 * global.LANG -- 语言数据标识(en_us, zh_cn, zh_tw)
 * session.lang -- 在session里保存一份语言数据标识，防止用户cookie丢失时语言设置失效(session 持久化)
 * cookie.lang -- 保存在客户端的语言数据标识，session.lang和cookie.lang保持同步
 */
const lang =  (function() {

  /* ------------------- 获取统一的语言环境标识 ------------------- */
  const getLANG = (acceptLang) => {
    // 英语
    if (['en-US', 'en', 'en-us', 'en_us'].indexOf(acceptLang) !== -1) {
      return 'en_us';
    }
    // 中文简体
    if (['zh-CN', 'zh', 'zh-cn', 'zh_cn'].indexOf(acceptLang) !== -1) {
      return 'zh_cn';
    }else
    // 中文繁体
    if (['zh-TW', 'zh-tw', 'zh_tw'].indexOf(acceptLang) !== -1) {
      return 'zh_tw';
    // 默认中文简体
    }else {
      return 'zh_cn';
    }
  }

  /* ------------------- 加载语言文件 ------------------- */
  const setLang = (req, res, langEnv, next) => {
    global.lang = global.lang ? global.lang : {};
    global.LANG = langEnv;
    if (!req.cookies['lang']) res.cookie('lang', langEnv);  // cookie失效的情况
    req.session.lang = langEnv;

    // 读取文件夹的语言配置文件写入全局配置
    fs.readdir(path.resolve(__dirname, langEnv), (err, files) => {
      if (err) {
        console.error(err);
        return next ? next() : null;
      }
      files.forEach((file) => {
        global.lang[file.replace('.js', '')] = require(path.resolve(__dirname, langEnv, file));
      });
      next ? next() : null;
    });
  }

  return function (req, res, next) {

    // 浏览器接受的语言
    const acceptLang =
      req.acceptsLanguages(['en-us', 'en', 'en-US','zh-cn', 'zh-CN', 'zh-tw', 'zh-TW', 'zh']);
    // 用户自定义语言
    const definedLang = req.cookies['lang'] || req.session.lang;

    // 优先使用用户自定义语言
    const _lang = definedLang ? getLANG(definedLang) : getLANG(acceptLang);

    if (global['LANG'] && global['LANG'] == _lang) {
      if (!req.cookies['lang']) res.cookie('lang', _lang);  // cookie失效的情况
      return next();
    }

    // 设置目前的语言环境
    setLang(req, res, _lang, next);

  }

})();

module.exports = lang;
