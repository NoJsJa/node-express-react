/**
* @name: Utils
* @description: 工具方法
*/

const xml2js = require('xml2js');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const fxp = require("fast-xml-parser");
const querystring =require('querystring');
const formidable = require('formidable');
const dns = require('dns');

/* ------------------- 获取数据类型 ------------------- */
exports.getDataType = (item) => {
  // 使用字符串方法判断
  const toString = Object.prototype.toString;
  const typeStr = toString.call(item);
  switch (typeStr) {
    case '[object Array]':
      return 'array';
      break;
    case '[object Object]':
      return 'object';
      break;
    case '[object Function]':
      return 'function';
      break;
    case '[object null]':
      return 'null';
      break;
    case '[object undefined]':
      return 'undefined';
      break;
    case '[object String]':
      return 'string';
      break;
    case '[object Number]':
      return 'number';
      break;
    default:
      return 'unknown'
  }
}

/* ------------------- 秒 => 时分秒 ------------------- */
exports.secondsToTime = (seconds) => {
  let hour, minute, second;
  seconds = parseInt( Number(seconds) );

  const formatData = (num) => {
    num < 10 ?
      num = '0' + num :
      num = num;
    return num;
  }

  if (seconds < 60) {
    return '00:' + formatData(seconds);
  }
  if (seconds < 3600) {
    second = formatData( seconds % 60 );
    minute = formatData( parseInt(seconds / 60) );
    return minute + ":" + second;
  }
  hour = formatData( parseInt(seconds / 3600) );
  minute = formatData( parseInt((seconds % 3600) / 60) );
  second = formatData( parseInt((seconds % 3600) % 60) );

  return hour + ":" + minute + ":" + second;
};


/* ------------------- 函数节流-throttle ------------------- */
exports.fnThrottle = (function (){
  // 存储所有需要调用的函数
  let fnObject = {};

  // 三个参数分别是被调用函数，设置的延迟时间，是否需要立即调用
  return function(fn, delayTime, IsImediate, args){

      // 立即调用
      if(!delayTime || IsImediate){
          return fn(args);
      }
      // 判断函数是否已经在调用中
      if(fnObject[fn]){
          return;
      }else {
          // 定时器
          const timer = setTimeout(function(){
              fn(args);
              //清除定时器
              clearTimeout(timer);
              delete(fnObject[fn]);
          }, delayTime);

          fnObject[fn] = {
              "status": 'waitToRun',
              "delayTime": delayTime,
              "timer": timer
          };
      }
  };
})();


/* ------------------- 函数去抖-debounce ------------------- */
exports.fnDebounce = (function () {
  // 存储所有需要调用的函数
  let fnObject = {};
  let timer;

  /**
   * @param  {Function} fn         [回调函数]
   * @param  {[Time]}   delayTime  [延迟时间(ms)]
   * @param  {Boolean}  isImediate [是否需要立即调用]
   * @param  {[type]}   args       [回调函数传入参数]
   */
  return function (fn, delayTime, isImediate, args) {

    // 设置定时器方法
    const setTimer = function () {
      timer = setTimeout(function () {
        fn(args);
        //清除定时器
        clearTimeout(timer);
        delete (fnObject[fn]);

      }, delayTime);

      fnObject[fn] = {
        "delayTime": delayTime,
        "timer": timer
      };
    };

    // 立即调用
    if (!delayTime || isImediate) return fn(args);

    // 判断函数是否已经在调用中
    if (fnObject[fn]) {
      clearTimeout(timer);
      // 定时器
      setTimer(fn, delayTime, args);
    } else {
      // 定时器
      setTimer(fn, delayTime, args);
    }
  };
})();


/* ------------------- bytes => 自适应常用单位 ------------------- */
exports.bytesToSize = (bytes) => {
  if (bytes == 0) return '0 B';

   const k = 1024;
   const sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   const i = Math.floor(Math.log(bytes) / Math.log(k));

   return Number(bytes / Math.pow(k, i)).toFixed(0) + ' ' + sizes[i];
};

/* ------------------- 观察者模式-构造函数 ------------------- */
exports.ObserverObject = function() {
  this.handlers = {};  // 待处理观察者
  this.addHandler = (type, handler) => {  // 添加一个观察者
    if (this.handlers[type]) {
      this.handlers[type].push(handler);

    }else {
      this.handlers[type] = [handler];
    }
  };
  this.trigger = (type) => {  // 触发观察者
    if (this.handlers[type]) {
      if (this.handlers[type] instanceof Array) {
        for (let i = 0, len = this.handlers[type].length; i < len; i++) {
          this.handlers[type][i]();
        }
      }
    }
  };
  this.remove = (type, handler) => {  // 移除观察者
    if (this.handlers[type] && typeof(handler) !== "undefined") {
      if (this.handlers[type] instanceof Array) {
        for (let i = 0, len = this.handlers[type].length; i < len; i++) {
          if (this.handlers[type][i]  == handler) {
            break;
          }
        }
        // 移除元素
        this.handlers[type].splice(i, 1);
        if (this.handlers[type].indexOf(handler) != -1) {
          this.remove(type, handler);
        }
      }
    }else {
      this.handlers[type] = [];
    }
  }
};

/**
  * xmlToJson [xml转换]
  * @param  {[String]} data [数据]
  * @param  {[String]} dataType [源数据类型]
  * @param  {[String]} callback [回调函数]
  * @return {[Object]} data [json对象]
  */
exports.xmlToJson = (data, dataType, callback) => {
  if (dataType === 'xml') {
    xml2js.parseString(data, { explicitArray : false, ignoreAttrs : true }, function (err, result) {
      if (err) {
        console.error('xml parse error: ', err);
        callback({});
      } else {
        callback(result);
      }
    });
  } else {
    callback(data);
  }
}

/**
  * jsonToXml [json转xml]
  * @param  {[String]} data [数据]
  * @param  {[String]} dataType [源数据类型]
  * @param  {[String]} callback [回调函数]
  */
 exports.jsonToXml = (data, dataType) => {
  if (dataType === 'xml' && data) {
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
    const defaultOptions = {
      attributeNamePrefix : "@_",
      attrNodeName: false, //default is false
      textNodeName : "#text",
      ignoreAttributes : false,
      cdataTagName: "__cdata", //default is false
      cdataPositionChar: "\\c",
      format: false,
      indentBy: "",
      supressEmptyNode: false,
      tagValueProcessor: a=> a,// default is a=>a
      attrValueProcessor: a=> a// default is a=>a
    }
    const xmlHeader = "<?xml version='1.0' encoding='utf-8'?>" ;
    // const xml = toXML(jsonData, {
    //   header: xmlHeader,
    // });
    // console.log(xml);
    // return xml;
    const obj2xml = new fxp.j2xParser(defaultOptions).parse(jsonData)
    console.log(obj2xml);
    return xmlHeader + obj2xml;

  } else {
    return data;
  }
}

/**
  * jsonToXml [json转xml]
  * @param  {[String]} data [数据]
  * @param  {[String]} dataType [源数据类型]
  * @param  {[String]} callback [回调函数]
  */
exports.getContentType = (headers, type, postData) => {
  let md5;
  if (type == 'xml' && typeof postData === 'string') {
    md5 = crypto.createHash('md5').update(postData).digest('base64');
  }
  const map =  {
    xml: {
      'Content-Type': 'text/xml; charset=UTF-8',
      'Content-MD5': md5,
    },
    json: { 'Content-Type': 'application/json'},
    form: { 'Content-Type': 'multipart/form-data' },
    text: { 'Content-Type': 'text/plain' },
    urlencoded: { 'Content-Type': 'application/x-www-form-urlencoded'},
  };
  const contentType = map[type] || {};
  return {...headers, ...contentType };
}

/**
  * jsonArray [解决xml转换后最后json字符串的最后一位是数组的问题]
  * @param  {[Object]} jsonData [xmlJson]
  * @return {[type]} data [xmlJsonParse]
  */
 /* 
 {
  "Name": [
    "bucket1"
  ],
  "CreationDate": [
    "2019-09-06T07:55:49.264Z"
  ]
 }
  */
exports.jsonArrayToString = (jsonData) => {
  if (typeof jsonData !== 'object') return jsonData;
  if (jsonData === null) return jsonData;

  const keys = Object.keys(jsonData);

  for (let i = 0; i < keys.length; i += 1) {
    // parse
    if (
      Array.isArray(jsonData[keys[i]]) &&
      jsonData[keys[i]].length === 1 &&
      typeof jsonData[keys[i]][0] === 'string'
    ) {
      jsonData[keys[i]] = jsonData[keys[i]][0];
    } else if (typeof jsonData[keys[i]] === 'object'){
      jsonData[keys[i]] = exports.jsonArrayToString(jsonData[keys[i]]);
    }
  }

  return jsonData;
}

/**
 * [ReadDirsString 给定目标路径将目标路径下的文件夹生成指定格式的路径map]
 * @param       {[String]} target  [相对或绝对路径]
 * @return      {[Object]} pathMap [路径map对象]
 */

 /*
   Example =>
   {
     'controller': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/controller',
     'controller.hyhive': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/controller/hyhive',
     'controller.infinity': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/controller/infinity',
     'controller.ipsan': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/controller/ipsan',
     'controller.public': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/controller/public',
     'inspector': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/inspector',
     'middleware': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/middleware',
     'mock.hyhive': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/mock/hyhive',
     'mock': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/mock',
     'mock.infinity': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/mock/infinity',
     'mock.public': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/mock/public',
     'model.hyhive': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/model/hyhive',
     'model': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/model',
     'model.infinity': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/model/infinity',
     'model.public': '/mnt/e/Ubuntu18.04/github/dview-new/dview/node-express-react/website/app/model/public'
   }
 */


exports.ReadDirsString = (target) => {
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
};

/* 并行构造Promise请求 -> 使用Promise.all */
exports.requestPromiseParallel = requestPromiseParallel = (infoArray) => {
  const array = infoArray instanceof Array ? infoArray : [infoArray];
  const promises = array.map((info) => {
    const { param, req, api, requestFunc, data} = info;
    return requestFunc(param, api, {...req, ...(req.headers || {})}, data);
  });
  return Promise.all(promises);
};

/* 混合构造Promise请求 -> 使用Promise.all 和 Promise.then */
exports.requestPromiseOrder = requestPromiseOrder = (infoArray) => {
  const array = infoArray instanceof Array ? infoArray : [infoArray];
  let promise, resultArray = [];
  const localErrorFunc = (errorFunc) => {
    return (error) => {
      resultArray.push(error);
      errorFunc(error);
    }
  };
  const resultPushFunc = (res, callback) => {
    if (res instanceof Array) return resultArray.push(...res);
    callback && callback(res);
    resultArray.push(res);
  };

  array.forEach((info) => {
    const { param, req, api, data,requestFunc, errorFunc, callback } = info;
    if (info instanceof Array) {
      if (!promise) {
        promise = requestPromiseParallel(info).then(
          (res) => resultPushFunc(res, callback),
          (res) => resultPushFunc(res, callback),
        );
        return;
      }
      promise = promise.then(
        () => requestPromiseParallel(info),
        localErrorFunc(errorFunc)
      ).then(
        (res) => resultPushFunc(res, callback),
        (res) => resultPushFunc(res, callback),
      );
      return;
    }
    if (!promise) {
      promise = requestFunc(param, api, {...req, ...(req.headers || {})}, data).then(
        (res) => resultPushFunc(res, callback),
        (res) => resultPushFunc(res, callback),
      );
      return;
    }
    promise = promise.then(
      () => requestFunc(param, api, {...req, ...(req.headers || {})}, data),
      localErrorFunc(errorFunc)
    ).then(
      (res) => resultPushFunc(res, callback),
      (res) => resultPushFunc(res, callback),
    )
    });

  return promise.then(() => resultArray);
};

/**
  * getHeaderCookie [获取请求头里cookie的某一项]
  * @param  {[String]} headerCookies [请求头的cookie]
  * @param  {[String]} name [某一项]
  */
 exports.getHeaderCookie = (headerCookies, name) => {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = headerCookies.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return null;
}

/**
  * templateStrTranform [模板字符串转换]
  * params1: {bucket: testBucket, uid: testUid, bucketId: testID}
  * params2: /admin/bucket?format=json&bucket={bucket}&uid={uid}&bucket-id={bucketId}
  * return: /admin/bucket?format=json&bucket=testBucket&uid=testUid&bucket-id=testID
  * 
  * @author nojsja
  * @param  {[Object]} varObj [替换变量对象]
  * @param {[String]} templateStr [模板字符串]
  * @return {[String]} result [模板字符串]
  */
 exports.templateStrTransform = (varObj, templateStr) => {
  if (typeof varObj !== 'object' || !templateStr) return templateStr;
  for (const attr in varObj) {
    if (varObj.hasOwnProperty(attr)) {
      templateStr = templateStr.replace(new RegExp(`{${attr}}`, 'g'), varObj[attr]);
    }
  }
  return templateStr;
};

/**
  * parseFile [使用formidable进行文件解析 - 性能一般]
  * @author nojsja
  * @param  {[Object]} req [req obj]
  * @param  {[Object]} res [res obj]
  */
exports.formidableParseFile = (req, res, callback) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      fs.readFile(files.file.path, (err, fileBuffer) => {
        if (err) {
          return callback(err);
        }
        callback(null, fileBuffer);
      });
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

/**
  * parseFile [form-data原生文件解析 - 性能差]
  * @author nojsja
  * @param  {[Object]} req [req obj]
  * @param  {[Object]} res [res obj]
  */
exports.parseFile = (req, res, callback) => {
  req.setEncoding('binary'); 
  let body = '';   // 文件数据
  let fileName = '';  // 文件名
  
  // 边界字符串
  const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=','');

  req.on('data', function(chunk){
    body += chunk;
  });

  req.on('end', function() {
    try {
      const file = querystring.parse(body, '\r\n', ':')
      //获取文件名
      const fileInfo = file['Content-Disposition'].split('; ');
      for (value in fileInfo){
        if (fileInfo[value].indexOf("filename=") != -1){
          fileName = fileInfo[value].substring(10, fileInfo[value].length-1); 
  
          if (fileName.indexOf('\\') != -1){
            fileName = fileName.substring(fileName.lastIndexOf('\\')+1);
          }
        }   
      }
  
      // 获取图片类型(如：image/gif 或 image/png))
      const entireData = body.toString();           
  
      contentType = file['Content-Type'].substring(1); 
  
      //获取文件二进制数据开始位置，即contentType的结尾
      const upperBoundary = entireData.indexOf(contentType) + contentType.length; 
      const shorterData = entireData.substring(upperBoundary); 
  
      // 替换开始位置的空格
      const binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  
      // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
      const binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--'+boundary+'--'));        

      callback(null, binaryData);
    } catch (error) {
      callback(new Error('form-data parse error!'));
    }

  });
};

/**
  * isBucketDir [判断是否是bucket目录]
  * @param  {[String]} str [对象key值]
  * @param  {[String]} prefix [桶内文件夹名]
  * @return {[Object]}
  */
exports.isBucketDir = (str, prefix) => {
  let bool = false;
  let name = str;
  // 条目是当前目录
  if (prefix === str) {
    bool = false;
  // 条目是文件夹或文件夹内对象
  } else if ((str[str.length - 1] === '/') || (str.replace(prefix, '').split('/').filter(s => s).length > 1)) {
    bool = true;
    name = `${str.replace(prefix, '').split('/').filter(s => s)[0]}/`;  
    // console.log(name);
  }
  return {
    bool,
    name: bool ? name : str.replace(prefix, ''),
    origin: str,
  };
}

/**
  * dnsParse [解析dns]
  * @author nojsja
  * @param  {[String]} host [域名]
  * @return {[Object]} [Promise]
  */
exports.dnsParser = async (host) => 
  await new Promise(function(resolve) {
    dns.lookup(host, (err, address, family) => {
      if (err) {
        resolve(host);
      } else {
        resolve(address);
      }
    });
  });