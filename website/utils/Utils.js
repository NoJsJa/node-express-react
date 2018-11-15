/**
* @name: Utils
* @description: 工具方法
*/

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
  const hour, minute, second;
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
}；


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
}


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
}；
