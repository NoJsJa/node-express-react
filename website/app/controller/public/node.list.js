const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');
const { commonApiConfig } = ModuleLoader('system', 'service.config.js');


// node list
router.post('/node/list', async function (req, res, next) {
  const ip = (await commonApiConfig(req.headers)).host;
  ipRequest({ _ip: ip }, nodeApi.list.getList, req.headers).then((response) => {
    res.json(response);
  })
});
// node list search
router.post('/node/list/search', function (req, res, next) {
  const ip = isEnvDev ? '10.0.7.15' : req.headers.host.split(':')[0];
  ipRequest({ _ip: ip, search: req.body.search }, nodeApi.list.getList, req.headers).then((response) => {
    res.json(response);
  })
});

// node info
router.post('/node/list/info', function (req, res, next) {
  ipRequest({ _ip: req.body._ip }, nodeApi.list.info, req.headers).then((response) => {
    res.json(response);
  })
});

// add node
router.post('/node/list/add', async (req, res, next) => {
  const ip = (await commonApiConfig(req.headers)).host;
  let obj = {
    _ip: ip,
    ip: req.body.ip,
  }
  ipRequest(obj, nodeApi.list.addNode, req.headers).then((response) => {
    res.json(response);
  })
});

//delete node
router.post('/node/list/delete', async (req, res, next) => {
  const ip = (await commonApiConfig(req.headers)).host;
  const url = {
    url: `${nodeApi.list.deleteNode.url}/${req.body.id}`,
    method: nodeApi.list.deleteNode.method,
    port: nodeApi.list.deleteNode.port,
  }
  ipRequest({ _ip: ip }, url, req.headers).then((response) => {
    res.json(response);
  })
});

//初始化节点
router.post('/node/cluster/init', async (req, res, next) => {
  const ip = (await commonApiConfig(req.headers)).host;
  let para = {
    _ip: ip,
  }
  Object.assign(para, req.body)
  ipRequest(para, nodeApi.list.initNode, req.headers).then((response) => {
    res.json(response);
  })
});
//操作日志
router.post('/node/log/operation', function (req, res, next) {
  let category = '';
  let subcategory = '';
  let tag = '';
  if (req.body.category) {
    for (let i = 0; i < req.body.category.length; i += 1) {
      if (i === req.body.category.length - 1) {
        category += `category=${req.body.category[i]}`
      }
      else {
        category += `category=${req.body.category[i]}&`;
      }
    }
  }
  if (req.body.tag) {
    for (let i = 0; i < req.body.tag.length; i += 1) {
      if (i === req.body.tag.length - 1) {
        tag += `tag=${req.body.tag[i]}`
      }
      else {
        tag += `tag=${req.body.tag[i]}&`;
      }
    }
  }
  if (req.body.subcategory) {
    for (let i = 0; i < req.body.subcategory.length; i += 1) {
      if (i === req.body.subcategory.length - 1) {
        subcategory += `subcategory=${req.body.subcategory[i]}`
      }
      else {
        subcategory += `subcategory=${req.body.subcategory[i]}&`;
      }
    }
  }
  delete req.body.category;
  delete req.body.subcategory;
  delete req.body.tag;
  const url = {
    url: `${nodeApi.list.operationLog.url}?${category}&${subcategory}&${tag}`,
    method: nodeApi.list.operationLog.method,
    port: nodeApi.list.operationLog.port,
  }
  ipRequest(req.body, url, req.headers).then((response) => {
    res.json(response);
  })
});

//节点列表的操作日志
router.post('/node/list/log', async function (req, res, next) {
  const ip = (await commonApiConfig(req.headers)).host;
  const url = {
    url: `${nodeApi.list.operationListLog.url}?page=${req.body.page}&count=${req.body.count}`,
    method: nodeApi.list.operationListLog.method,
    port: nodeApi.list.operationListLog.port,
  }
  ipRequest({ _ip: ip }, url, req.headers).then((response) => {
    res.json(response);
  })
});

// ipmi和导航的操作日志
router.post('/node/ipmiAndpower/log', function (req, res, next) {
  const ip = isEnvDev ? '10.0.7.15' : req.headers.host.split(':')[0];
  const url = {
    url: `${nodeApi.list.operationIpmiPowerLog.url}/${req.body.id}/${req.body.type}?page=${req.body.page}&count=${req.body.count}`,
    method: nodeApi.list.operationIpmiPowerLog.method,
    port: nodeApi.list.operationIpmiPowerLog.port,
  }
  ipRequest({ _ip: ip }, url, req.headers).then((response) => {
    res.json(response);
  })
});
module.exports = router;
