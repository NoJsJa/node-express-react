const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = express.Router();

/**
 * [跨域测试]
 * @type {Object}
 */
  router.post('/cors/test', (req, res, next) => {
    axios.post('http://10.0.7.36:3000/node/list', {
    })
    .then(function (response) {
      console.log('cors test -> rsp: ', response.data);
      res.json({
        code: 200,
        result: response.data
      });
    })
    .catch(function (error) {
      console.log('cors test -> err: ', error);
      res.json({
        code: 300,
      });
    });
  });

module.exports = router;
