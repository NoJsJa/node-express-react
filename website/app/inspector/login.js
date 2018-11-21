/**
* @name: 登录拦截器
* @description: 登录状态检测
*/
const express = require('express');
const router = express.Router();
const access_token = 'sfdaksfdjlsdkfskd';

router.get('/', function (req, res, next) {
  if (global.isEnvDev)
  return next();

  if (req.path === '/login')
  return next();

  const accessKey = req.cookies['access_token'],
  name = req.session['name'],
  pwd = req.session['pwd'];

  if (accessKey == access_token && name && pwd){
    next();
  } else {
    res.redirect(302, '/login');
  }
});

module.exports = router;
