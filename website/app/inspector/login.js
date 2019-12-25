/**
* @name: 登录拦截器
* @description: 登录状态检测
*/

const access_token = 'sfdaksfdjlsdkfskd';
// test
const loginInspector =  function (req, res, next) {

  return next(); // 时直接跳过检测
  if (req.path === '/login') {
    return next();
  }
  const accessKey = req.cookies['access_token'],
    name = req.session['name'],
    pwd = req.session['pwd'];

  if (accessKey == access_token && name && pwd){
    next();
  }else {
    if (req.method.toUpperCase() === 'GET') {
      res.redirect(302, '/login');
    }else {
      res.json({
        code: 600,
        result: 'Access Denied'
      });
    }
  }

};

module.exports = loginInspector;
