const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const access_token = 'sfdaksfdjlsdkfskd';

/* get home pagetest */
router.get('/', function(req, res, next) {

  fs.readFile(`${_path.dist}/index.html`, (err, data) => {
    if (err) {
      console.error(err);
      return res.render('error', {
        message: lang['public'].request_error,
        error: err }
      );
    }
    res.set('Content-Type', 'text/html');
    res.send(data);
  });

});


/* get login page */
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: lang['public'].login,
    set_lang_en: lang['public'].set_lang_en,
    set_lang_zh: lang['public'].set_lang_zh,
    client: lang['public'].client,
    chinese: lang['public'].chinese,
    english: lang['public'].english,
    language: lang['public'].language,
    now_lang: lang['public'].now_lang,
    version: 'v2.3.9-54488_Release',
    chrome_browser: lang['public'].chrome_browser
  });
});

/* handle login */
router.post('/login', function (req, res, next) {

    if (req.body['name'] == 'admin' && req.body['pwd'] == '123456') {
      res.cookie('access_token', access_token, {
        expires: new Date(Date.now() + 3600000), httpOnly: true
      });
      req.session.name = req.body['name'];
      req.session.pwd = req.body['pwd'];
      res.redirect('/');
    }else {
      res.render('login', {
        title: lang['public'].login_fail,
        login_fail: lang['public'].login_fail,
        set_lang_en: lang['public'].set_lang_en,
        set_lang_zh: lang['public'].set_lang_zh,
        client: lang['public'].client,
        chinese: lang['public'].chinese,
        english: lang['public'].english,
        language: lang['public'].language,
        now_lang: lang['public'].now_lang,
        version: 'v2.3.9-54488_Release',
        chrome_browser: lang['public'].chrome_browser
      });
    }

});

/* handle logout */
router.post('/logout', function (req, res, next) {
  req.session.name = null;
  req.session.pwd = null;
  res.clearCookie('access_token');
  res.redirect('/login');
});

/* set lang */
router.post('/setlang', function (req, res, next) {

    req.session.lang = req.body.lang;
    res.clearCookie('lang');
    res.cookie('lang', req.body.lang);
    res.status(200).json({
      code: 200,
      result: 'ok'
    });
});

module.exports = router;
