const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');


// 节点基本信息
router.post('/node/abstract/basic', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.getBasicInfo, req.headers).then((response) => {
    res.json(response);
  })
});
// 节点概况信息
router.post('/node/abstract', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.abstract, req.headers).then((response) => {
    res.json(response);
  })
});

// 可选时区列表 
router.post('/node/abstract/zone/list', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.zoneList, req.headers).then((response) => {
    res.json(response);
  })
});

// 设置物理机时区
router.post('/node/abstract/zone/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.zoneEdit, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询时间详情
router.post('/node/abstract/time/detail', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.getTime, req.headers).then((response) => {
    res.json(response);
  })
});

// 设置时间
router.post('/node/abstract/time/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.editTime, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询主机型号
router.post('/node/abstract/model', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.getModel, req.headers).then((response) => {
    res.json(response);
  })
});

// 设置主机型号
router.post('/node/abstract/model/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.editModel, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询主机名称
router.post('/node/abstract/hostname', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.getHostname, req.headers).then((response) => {
    res.json(response);
  })
});

// 设置主机名称
router.post('/node/abstract/hostname/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.editHsotname, req.headers).then((response) => {
    res.json(response);
  })
});

// 关机
router.post('/node/abstract/power/off', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.powerOff, req.headers).then((response) => {
    res.json(response);
  })
});

// 重启
router.post('/node/abstract/power/restart', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.powerRestart, req.headers).then((response) => {
    res.json(response);
  })
});
// 电源强制操作
router.post('/node/abstract/power/control', function (req, res, next) {
  const ip = isEnvDev ? '10.0.7.15' : req.headers.host.split(':')[0];
  const url = {
    url: `/nodes/${req.body.id}/power?action=${req.body.action}`,
    port: nodeApi.abstract.powerControl.port,
    method: nodeApi.abstract.powerControl.method,
  }
  delete req.body.id;
  delete req.body.action;
  ipRequest({ _ip: ip }, url, req.headers).then((response) => {
    res.json(response);
  })
});
// 查询电源信息
router.post('/node/abstract/power/status', function (req, res, next) {
  const ip = isEnvDev ? '10.0.7.15' : req.headers.host.split(':')[0];
  const url = {
    url: `/nodes/${req.body.id}/power`,
    port: nodeApi.abstract.powerStatus.port,
    method: nodeApi.abstract.powerStatus.method,
  }
  delete req.body.id;
  ipRequest({ _ip: ip }, url, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询ipmi信息
router.post('/node/abstract/ipmi', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.getIpmiInfo, req.headers).then((response) => {
    res.json(response);
  })
});
// 查询当前ipmi的信息
router.post('/node/abstract/ipmi/current', function (req, res, next) {
  const ip = isEnvDev ? '10.0.7.15' : req.headers.host.split(':')[0];
  const url = {
    url: '/nodes/' + req.body.id + '/ipmi',
    method: nodeApi.abstract.getIpmiCurrent.method,
    port: nodeApi.abstract.getIpmiCurrent.port,
  };
  delete req.body.id;
  ipRequest({ _ip: ip }, url, req.headers).then((response) => {
    res.json(response);
  })
});
// 更新当前ipmi的信息
router.post('/node/abstract/ipmi/update/current', function (req, res, next) {
  const url = {
    url: '/nodes/' + req.body.id + '/ipmi',
    method: nodeApi.abstract.updateIpmiCurrent.method,
    port: nodeApi.abstract.updateIpmiCurrent.port,
  };
  delete req.body.id;
  ipRequest(req.body, url, req.headers).then((response) => {
    res.json(response);
  })
});
// 修改IPmi密码
router.post('/node/abstract/ipmi/password/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.editIpmiPwd, req.headers).then((response) => {
    res.json(response);
  })
});

// 设置ipmi网络
router.post('/node/abstract/ipmi/lan/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.editIpmiLan, req.headers).then((response) => {
    res.json(response);
  })
});
// 定时扫描周期
router.post('/node/abstract/monitor/cycle/list', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.getMonitorCycle, req.headers).then((response) => {
    res.json(response);
  })
});
// 设置定时扫描周期
router.post('/node/abstract/monitor/cycle/set', function (req, res, next) {
  ipRequest(req.body, nodeApi.abstract.setMonitorCycle, req.headers).then((response) => {
    res.json(response);
  })
});
module.exports = router;
