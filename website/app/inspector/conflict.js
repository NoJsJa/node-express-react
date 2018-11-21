/**
* @name: 冲突拦截器
* @description: express路由会跟react路由冲突，这边直接将首页发送给浏览器，前端路由
* @description：再根据地址栏跳转(前端路由会自动监听地址变化)
* @description: 但是这样直接拦截get请求会将静态文件的请求也拦截了，所以这个中间件要放在express.static
* @description: 后使用，见app.js
*/

const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/*', function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../../../public/dist/index.html'));
});

module.exports = router;
