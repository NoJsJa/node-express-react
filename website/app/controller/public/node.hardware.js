const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');



// 查询cpu信息
router.post('/node/hardware/cpu', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getCpuDetail, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询主板信息
router.post('/node/hardware/motherboard', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getMotherboardDetail, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询风扇信息
router.post('/node/hardware/fan', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getFanDetail, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询pcie信息
router.post('/node/hardware/pcie', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getPcieDetail, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询memory信息
router.post('/node/hardware/memory', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getMemoryDetail, req.headers).then((response) => {
    res.json(response);
  })
});
// 查询历史记录
router.post('/node/monitor/histories', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getMonitorHistories, req.headers).then((response) => {
    res.json(response);
  })
});
// 查询变更
router.post('/node/monitor/changes/list', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.getMonitorChanges, req.headers).then((response) => {
    res.json(response);
  })
});
// 确认变更
router.post('/node/monitor/changes/confirm', function (req, res, next) {
  ipRequest(req.body, nodeApi.hardware.confirmMonitorChanges, req.headers).then((response) => {
    res.json(response);
  })
});

module.exports = router;
