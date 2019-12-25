const Mock = require('mockjs');
const express = require('express');
const router = express.Router();

router.post('/mock/hyhive/module1', function (req, res, next) {
  res.json({
    code: 200,
    result: Mock.mock({
      'list|2': [1,2,3]
    })
  })
});

module.exports = router;
