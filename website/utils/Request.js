/**
* @name: Request
* @description: 接口请求函数
*/

/**
* @name: Request
* @description: 接口请求函数
*/

import axios from 'axios';

const store = {
  token: 'user_token',
};

const serviceUrl = 'http://10.0.6.203:3000';

const XHR = axios.create({

  baseURl: '',

  timeout: 30e3,

  headers: {
    'Content-Type': 'application/json',
  },

  // withCredentials: true,
  // |--- 不同源时设置本地cookie
  // |--- 且服务器Access-Control-Allow-Origin不能设置为"*"

  validateStatus(status) {
    return status >= 200 && status < 300; // default
  },

});

XHR.interceptors.request.use((request) => {
  if (store.token === 'user') {
    request.headers['X-Token'] = store.token;
  }
  return request;
}, (error) => {
  console.log('error', error.code);
  Promise.reject(error);
});

export function postData(data, api, solve) {
  return new Promise((resolve, reject) => {
    XHR({

      url: serviceUrl + api,

      method: 'post',

      data,

    }).then((response) => {

      if (response.data.code === 200) {

        resolve(response.data);

      } else {

        if (solve) {

          resolve(response.data);

        } else {

          response.data.message ?

            console.log('error', null, response.data.message) :

            console.log('error', null, response.data.code);

          reject();

        }

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}



export function statisticsPostData(data, api, solve) {

  return new Promise((resolve, reject) => {

    XHR({

      url: serviceUrl + api,

      method: 'post',

      data,

    }).then((response) => {

      if (response.data.status === 'success') {

        resolve(response.data);

      } else if (solve) {

        resolve(response.data);

      } else {

        if (response.data.message) {

          console.log('error', null, response.data.message);

        } else {

          console.log('error', null, response.data.status);

        }

        reject();

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}



export function getData(data, api, solve) {

  return new Promise((resolve, reject) => {

    axios.get(serviceUrl + api, {

      params: data,

    }).then((response) => {

      if (response.data.code === 200) {

        resolve(response.data);

      } else {

        if (solve) {

          resolve(response.data);

        } else {

          response.data.message ?

            console.log('error', null, response.data.message) :

            console.log('error', null, response.data.code);

          reject();

        }

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}



export function deleteData(data, api, solve) {

  return new Promise((resolve, reject) => {

    XHR({

      url: serviceUrl + api,

      method: 'delete',

      data,

    }).then((response) => {

      if (response.data.code === 200) {

        resolve(response.data);

      } else {

        if (solve) {

          resolve(response.data);

        } else {

          response.data.message ?

            console.log('error', null, response.data.message) :

            console.log('error', null, response.data.code);

          reject();

        }

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}



export function headData(data, api, solve) {

  return new Promise((resolve, reject) => {

    XHR({

      url: serviceUrl + api,

      method: 'head',

      data,

    }).then((response) => {

      if (response.data.code === 200) {

        resolve(response.data);

      } else {

        if (solve) {

          resolve(response.data);

        } else {

          response.data.message ?

            console.log('error', null, response.data.message) :

            console.log('error', null, response.data.code);

          reject();

        }

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}



export function putData(data, api, solve) {

  return new Promise((resolve, reject) => {

    XHR({

      url: serviceUrl + api,

      method: 'put',

      data,

    }).then((response) => {

      if (response.data.code === 200) {

        resolve(response.data);

      } else {

        if (solve) {

          resolve(response.data);

        } else {

          response.data.message ?

            console.log('error', null, response.data.message) :

            console.log('error', null, response.data.code);

          reject();

        }

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}



export function patchData(data, api, solve) {

  return new Promise((resolve, reject) => {

    XHR({

      url: serviceUrl + api,

      method: 'patch',

      data,

    }).then((response) => {

      if (response.data.code === 200) {

        resolve(response.data);

      } else {

        if (solve) {

          resolve(response.data);

        } else {

          response.data.message ?

            console.log('error', null, response.data.message) :

            console.log('error', null, response.data.code);

          reject();

        }

      }

    }).catch((error) => {

      console.log('error', error.code);

    });

  });

}
