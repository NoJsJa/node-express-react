/**
* @name: AccessControl
* @description: 权限控制和管理
*/

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const access_token = 'sfdaksfdjlsdkfskd';

/**
 * [AccessControl 权限控制和管理]
 * @type {Object}
 */
  router.post('/permission', (req, res, next) => {
      ModuleLoader('model', 'Permission.js').
        check('user').
        then(function (result) {
          if (result['code'] == 200) {
            res.json({
              code: 200,
              result: 'ok'
            });
          }else {
            res.json({
              code: 300
            });
          }
        })
  });

  const hasPermission = ($page) => {
      // $logininfo = Session::getLander();
      // $PERMISSION = $GLOBALS["PERMISSION"];
      // $permis = $PERMISSION[$page][0];
      // if ((($permis & $logininfo['permission']) === $permis) && ($PERMISSION[$page][1] === false)) {
      //     return true;
      // }
      // return false;
  };

  const hasLogin = () => {
    // $logininfo = Session::getLander();
    //     if ($logininfo != '') {
    //         if ($logininfo['name'] != "" && $logininfo['token'] != "")
    //             return true;
    //     }
    // if (isset ($_COOKIE['access_token'])) {
    //   return true;
    // }
    // return false;
  };

  const login = ($username, $password) => {
    //
    // TODO 保存密码的功能还没实现
    // 发送请求查看密码是否正确
    // $password_md5 = md5($password);
    // $result = Box::getObject('User', 'model')->login($username, $password);
    // // fb ($result);
    // $result = Util::jsondecode($result, true);
    // if ($result['code'] != CGI_SUCCESS) {
    //   return false;
    // }
    // $token = $result['result']['access_token'];
    // $lang = Session::get('lang');
    // $lang == '' ? $lang = 'zh_cn' : '';
    // // $token = "X7yABwjE20sUJLefATUFqU0iUs8mJPqEJo6iRnV63mI=";
    //
    // // 发送一个 1 小时候过期的 cookie
    // setcookie("access_token", $token, time() + 3600 * 1, '/');
    // setcookie("login_user", $username, time() + 3600 * 1, '/');
    // setcookie("lang", $lang, time() + 3600 * 24, '/');
    // Session::set ("access_token", $token);
    // Session::set ("login_user", $username);
    // // 保存session和license
    // $res = Box::getObject('user', 'model')->info($username);
    // $result = json_decode($res, true);
    // $roleids = '';
    // $groupname = '';
    // $uid = '';
    // $nickname = '';
    // if ($result['code'] == 200) {
    //     $userinfo = $result['result'];
    //     $uid = $userinfo['userid'];
    //     $nickname = $userinfo['nickname'];
    //     $groupname = $userinfo['groupname'];
    //     $groupid = $userinfo['groupid'];
    // }
    // $lander = [
    //     'name' => $username,
    //     'groupname' => $groupname,
    //     'uid' => $uid,
    //     'token' => $token,
    //     'groupid' => $groupid,
    //     'nickname' => $nickname
    // ];
    // Session::setLander($lander, $token);
    //
    // return ['code' => 200, 'token' => $token, "uid"=>$uid];
  };

  const logout = () => {
    // setcookie("access_token", "", time() - 3600 * 24, '/');
    // setcookie("login_user", "", time() - 3600 * 24, '/');
    // Session::destroy ("access_token");
    // Session::destroy ("login_user");
  };

  const getLoginUserInfo = () => {
    // $logininfo = Session::getLander();
    // return $logininfo;
  };


module.exports = router;
