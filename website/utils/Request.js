const axios = require('axios');
const qs = require('qs');

const {
  commonApiConfig,
  hyhiveApiConfig,
  infinityApiConfig,
} = ModuleLoader('system', 'service.config.js');
const { awsEnvRegistry } = ModuleLoader('utils', 'aws-signature-v4.js');
const {
  templateStrTransform,
  xmlToJson,
  jsonToXml,
  jsonArrayToString,
  getContentType,
  getHeaderCookie
} = ModuleLoader('utils', 'Utils.js');

const XHR = axios.create({
  // baseURl: '',
  timeout: 120e3,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  validateStatus(status) {
    return status >= 200 && status < 300; // default
  },
});

XHR.interceptors.request.use((request) => {
  return request;
}, (error) => {
  return error;
});

const commonRequest = async (data, api, reqHeaders) => {
  const url = `${(await commonApiConfig(reqHeaders)).host}:${api.port}${templateStrTransform(data, api.url)}`;
  const accessToken = getHeaderCookie(reqHeaders.cookie, 'access_token');
  const lang = getHeaderCookie(reqHeaders.cookie, 'lang')
  
  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: {
          ...{ "cookie": reqHeaders.cookie },
          ...( accessToken ? { "access-token": accessToken } : { "access-token" : infinityApiConfig(reqHeaders)['access-token'] }),
          "lang": lang,
          "LANG": lang,
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      XHR({
        url: url,
        method: api.method,
        data,
        headers: {
          ...{ "cookie": reqHeaders.cookie },
          ...( accessToken ? { "access-token": accessToken } : { "access-token" : infinityApiConfig(reqHeaders)['access-token'] }),
          "lang": lang,
          "LANG": lang,
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  }
};


const ipRequest = (data, api, reqHeaders) => {
  const url = `http://${data._ip}:${api.port}${templateStrTransform(data, api.url)}`
  const accessToken = getHeaderCookie(reqHeaders.cookie, 'access_token');
  const lang = getHeaderCookie(reqHeaders.cookie, 'lang')

  delete data._ip
  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: {
          ...{ "cookie": reqHeaders.cookie },
          ...( accessToken ? { "access-token": accessToken } : { "access-token" : infinityApiConfig(reqHeaders)['access-token'] }),
          "lang": lang,
          "LANG": lang,
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      XHR({
        url: url,
        method: api.method,
        data,
        headers: {
          ...{ "cookie": reqHeaders.cookie },
          ...( accessToken ? { "access-token": accessToken } : { "access-token" : infinityApiConfig(reqHeaders)['access-token'] }),
          "lang": lang,
          "LANG": lang,
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  }
};

/* 
  process.env.AWS_ACCESS_KEY_ID = 'REIGCP02F0XGPLOE4419';
  process.env.AWS_SECRET_ACCESS_KEY = 'NgBjLufOuYhPcff4knWtlbyCKjBKorrtkc2tyZ3F';
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_SERVICE = 's3';
  process.env.AWS_SESSION_TOKEN = undefined;
  process.env.AWS_S3_BUCKET = undefined;
*/
exports.aws4RequestSign = async (req, path, method, port) => {
  const aws4 = require('aws4');
  var opts = {
    host: `${(await commonApiConfig(req.headers)).host}:${port}`,
    path,
    url: (await commonApiConfig(req.headers)).host,
    signQuery: true,
    service: process.env.AWS_SERVICE,
    region: process.env.AWS_REGION,
    method: method.toUpperCase(),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: req.body,
    data: '',
  }
  // assumes AWS credentials are available in process.env
  aws4.sign(opts)

  return opts;
}

/**
  * commonRequestAuth [aws-s3接口兼容访问函数]
  * @author nojsja
  * @param  {[Object]} params [请求参数对象，用于构造访问地址url|必须]
  * @param  {[Object]} api [请求接口对象，包含url/port/type等信息|必须]]
  * @param  {[Object]} req [http请求对象|必须]
  * @param  {[Object]} data [body二进制数据用于文件上传等操作|非必须]
  * @return {[Object]} promise [返回promise对象]
  */
// const commonRequestAuth = (params, api, req, data) => {
//   // 使用params对象转换存在动态变量的url
//   const parsedUrl = templateStrTransform(params, api.url);
//   // aws env set
//   awsEnvRegistry({
//     key: req.cookies.access_key,
//     secret: req.cookies.secret_key,
//   });
//   // 签署请求头
//   const postData = jsonToXml(data, api.reqType);
//   const awsOpts = exports.aws4RequestSign(req, parsedUrl, api.method, api.port);

//   return new Promise((resolve, reject) => {
//     axios({
//       baseURL: awsOpts.host,
//       url: awsOpts.path,
//       method: awsOpts.method,
//       headers: getContentType(awsOpts.headers, api.reqType, postData),
//       data: postData,
//     }).then((response) => {
//       // 转换xml
//       xmlToJson(response.data, api.type || 'json', (data) => {
//         resolve({
//           data,
//           // data: jsonArrayToString(data),
//           headers: response.headers,
//         });
//       });
//     }).catch((error) => {
//       resolve({ headers: error.config, data: error.response.data, code: 600 });
//       console.error('error: >>>>', error.response.data);
//     });
//   });
// };

const commonRequestAuth = async (params, api, req, data) => {  
  // 使用params对象转换存在动态变量的url  
  const parsedUrl = templateStrTransform(params, api.url);
  // aws env set
  awsEnvRegistry({
    key: req.cookies.access_key,
    secret: req.cookies.secret_key,
  });
  // 签署请求头
  const postData = jsonToXml(data, api.reqType);
  const awsOpts = await exports.aws4RequestSign(req, parsedUrl, api.method, api.port);

  return new Promise((resolve, reject) => {
    axios({
      baseURL: awsOpts.host,
      url: awsOpts.path,
      method: awsOpts.method,
      timeout: 180e3,
      headers: getContentType(awsOpts.headers, api.reqType, postData),
      data: postData,
      responseType: api.resType,
    }).then((response) => {
      // 转换xml
      try {
        xmlToJson(response.data, api.type || 'json', (data) => {
          resolve({
            result: data,
            code: 200,
            // data: jsonArrayToString(data),
            headers: response.headers,
          });
        });
      } catch (error) {
        resolve({
          code: 500,
          result: global.lang.xml_parse_error,
        });
      }
    }).catch((error) => {
      xmlToJson(error.response.data, 'xml', (data) => {
        resolve({
          code: 600,
          result: { headers: error.config, data: data.Error ? data.Error : error.response.data}
        })
      })
    });
  });
};

const commonRequestEncoded = async (data, api, reqHeaders) => {
  const url = `${(await commonApiConfig(reqHeaders)).host}:${api.port}${templateStrTransform(data, api.url)}`;
  const lang = getHeaderCookie(reqHeaders.cookie, 'lang')

  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: Object.assign({
          "cookie": reqHeaders.cookie || '',
          "lang": lang,
          "LANG": lang,
        }, api['access-token'] ? { "access-token": api['access-token'] } : {}),
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      XHR({
        url,
        method: api.method,
        data: qs.stringify(data),
        headers: Object.assign({
          "cookie": reqHeaders.cookie || '',
          "content-type": 'application/x-www-form-urlencoded',
          "lang": lang,
          "LANG": lang,
        }, api['access-token'] ? { "access-token": api['access-token'] } : {}),
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  }
};


const ipRequestEncoded = (data, api, reqHeaders) => {
  const url = `http://${data._ip}:${api.port}${templateStrTransform(data, api.url)}`
  delete data._ip
  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: Object.assign({
          "cookie": reqHeaders.cookie || '',
        }, api['access-token'] ? { "access-token": api['access-token'] } : {}),
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      XHR({
        url: url,
        method: api.method,
        data: qs.stringify(data),
        headers: Object.assign({
          "cookie": reqHeaders.cookie || '',
          "content-type": 'application/x-www-form-urlencoded',
        }, api['access-token'] ? { "access-token": api['access-token'] } : {}),
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  }
};

/**
 * infinityTokenRequest[调用原infinity接口，需要把cookie里的access-token放在headers传过去]
 * @param {[Object]} data 
 * @param {[Object]} api 
 * @param {[Object]} reqHeaders 
 */
const infinityTokenRequest = async (data, api, reqHeaders) => {
  const url = `${(await commonApiConfig(reqHeaders)).host}:${api.port}${templateStrTransform(data, api.url)}`;
  const lang = getHeaderCookie(reqHeaders.cookie, 'lang')
  const accessToken = getHeaderCookie(reqHeaders.cookie, 'access_token');
  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: Object.assign({
          "cookie": reqHeaders.cookie,
          "lang": lang,
          "LANG": lang,
        }, accessToken ? { "access-token": accessToken } : {}),
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      XHR({
        url: url,
        method: api.method,
        data: qs.stringify(data),
        headers: Object.assign({
          "cookie": reqHeaders.cookie,
          "content-type": 'application/x-www-form-urlencoded',
        }, accessToken ? { "Access-Token": accessToken } : {}),
        "lang": lang,
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        }
        resolve(obj);
      });
    });
  }
};


global.commonRequest = commonRequest;
exports.commonRequest = commonRequest;
global.commonRequestEncoded = commonRequestEncoded;
exports.commonRequestEncoded = commonRequestEncoded;
global.ipRequest = ipRequest;
exports.ipRequest = ipRequest;
global.ipRequestEncoded = ipRequestEncoded;
exports.ipRequestEncoded = ipRequestEncoded;
global.commonRequestAuth = commonRequestAuth;
exports.commonRequestAuth = commonRequestAuth;
global.infinityTokenRequest = infinityTokenRequest;
exports.infinityTokenRequest = infinityTokenRequest;
global.Axios = axios;
exports.Axios = axios;
