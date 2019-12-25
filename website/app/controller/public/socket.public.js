const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');

// 节点基本信息
router.post('/node/socket/test', function (req, res, next) {
  res.json({ code: 200, result: '100' })
});

module.exports = router;
