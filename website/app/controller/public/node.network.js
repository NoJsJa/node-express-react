const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');


// 查询物理设备信息
router.post('/node/network/devices', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.getNetworkDevice, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询网口名称
router.post('/node/network/interfaces', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.getNetworkInterfaces, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询连接
router.post('/node/network/links', function (req, res, next) {
  if (req.body.type.indexOf('&') >= 0) {
    let url = nodeApi.network.getNetworkLinks.url + '?' + req.body.type
    if (req.body.family) {
      url = url + '&family=' + req.body.family
      delete req.body.family;
    }
    delete req.body.type;
    ipRequest(req.body, {
      url: url,
      method: nodeApi.network.getNetworkLinks.method,
      port: nodeApi.network.getNetworkLinks.port
    }, req.headers).then((response) => {
      res.json(response);
    })
  } else {
    ipRequest(req.body, nodeApi.network.getNetworkLinks, req.headers).then((response) => {
      res.json(response);
    })
  }
});

// 网口-启用
router.post('/node/network/links/status/up', function (req, res, next) {
  const url = {
    url: '/network/links/' + req.body.name + '/up',
    method: nodeApi.network.NetworkPortEnabled.method,
    port: nodeApi.network.NetworkPortEnabled.port,
  };
  delete req.body.name;
  ipRequest(req.body, url, req.headers).then((response) => {
    res.json(response);
  })
});

// 网口-停用
router.post('/node/network/links/status/down', function (req, res, next) {
  const url = {
    url: '/network/links/' + req.body.name + '/down',
    method: nodeApi.network.NetworkPortDisabled.method,
    port: nodeApi.network.NetworkPortDisabled.port,
  };
  delete req.body.name;
  ipRequest(req.body, url, req.headers).then((response) => {
    res.json(response);
  })
});

// 绑定-创建
router.post('/node/network/bonding/create', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.addNetworkBonding, req.headers).then((response) => {
    res.json(response);
  })
});

// 绑定-删除
router.post('/node/network/bonding/delete', function (req, res, next) {
  const bondingUrl = {
    url: '/network/links/' + req.body.name,
    method: nodeApi.network.deleteNetworkBonding.method,
    port: nodeApi.network.deleteNetworkBonding.port
  };
  delete req.body.name;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 绑定-解绑
router.post('/node/network/bonding/unbind', function (req, res, next) {
  const bondingUrl = {
    url: '/network/bonding/' + req.body.name,
    method: nodeApi.network.unbindNetworkBonding.method,
    port: nodeApi.network.unbindNetworkBonding.port
  };
  delete req.body.name;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 绑定-添加子口
router.post('/node/network/bonding/slaves/add', function (req, res, next) {
  const bondingUrl = {
    url: '/network/bonding/' + req.body.master + '/slaves/' + req.body.slave,
    method: nodeApi.network.addNetworkBondingSlave.method,
    port: nodeApi.network.addNetworkBondingSlave.port
  };
  delete req.body.master;
  delete req.body.slave;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 绑定-移除子口
router.post('/node/network/bonding/slaves/delete', function (req, res, next) {
  const bondingUrl = {
    url: '/network/bonding/' + req.body.master + '/slaves/' + req.body.slave,
    method: nodeApi.network.deleteNetworkBondingSlave.method,
    port: nodeApi.network.deleteNetworkBondingSlave.port
  };
  delete req.body.master;
  delete req.body.slave;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 网桥-创建
router.post('/node/network/bridge/create', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.createNetworkBridge, req.headers).then((response) => {
    res.json(response);
  })
});

// 网桥-删除
router.post('/node/network/bridge/delete', function (req, res, next) {
  const bondingUrl = {
    url: '/network/bridge/' + req.body.name,
    method: nodeApi.network.deleteNetworkBridge.method,
    port: nodeApi.network.deleteNetworkBridge.port
  };
  delete req.body.name;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 网桥-添加子口
router.post('/node/network/bridge/slaves/add', function (req, res, next) {
  const bondingUrl = {
    url: '/network/bridge/' + req.body.master + '/slaves/' + req.body.slave,
    method: nodeApi.network.addNetworkBridgeSlave.method,
    port: nodeApi.network.addNetworkBridgeSlave.port
  };
  delete req.body.master;
  delete req.body.slave;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 网桥-移除子口
router.post('/node/network/bridge/slaves/delete', function (req, res, next) {
  const bondingUrl = {
    url: '/network/bridge/' + req.body.master + '/slaves/' + req.body.slave,
    method: nodeApi.network.deleteNetworkBridgeSlave.method,
    port: nodeApi.network.deleteNetworkBridgeSlave.port
  };
  delete req.body.master;
  delete req.body.slave;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// dns-查询
router.post('/node/network/nameservers', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.getNetworkNameservers, req.headers).then((response) => {
    res.json(response);
  })
});

// dns-设置
router.post('/node/network/nameservers/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.editNetworkNameservers, req.headers).then((response) => {
    res.json(response);
  })
});

// ip-设置
router.post('/node/network/ipaddr/edit', function (req, res, next) {
  const bondingUrl = {
    url: '/network/links/' + req.body.name,
    method: nodeApi.network.editNetworkIpaddr.method,
    port: nodeApi.network.editNetworkIpaddr.port,
  };
  delete req.body.name;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// ip-添加别名
router.post('/node/network/links/alias/add', function (req, res, next) {
  const bondingUrl = {
    url: '/network/links/' + req.body.name + '/alias',
    method: nodeApi.network.addNetworkLinksAlias.method,
    port: nodeApi.network.addNetworkLinksAlias.port,
  };
  delete req.body.name;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// ip-设置别名
router.post('/node/network/links/alias/edit', function (req, res, next) {
  const bondingUrl = {
    url: '/network/links/' + req.body.name + '/alias/' + req.body.alias,
    method: nodeApi.network.editNetworkLinksAlias.method,
    port: nodeApi.network.editNetworkLinksAlias.port
  };
  delete req.body.name;
  delete req.body.alias;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// ip-删除别名
router.post('/node/network/links/alias/delete', function (req, res, next) {
  const bondingUrl = {
    url: '/network/links/' + req.body.name + '/alias/' + req.body.alias,
    method: nodeApi.network.deleteNetworkLinksAlias.method,
    port: nodeApi.network.deleteNetworkLinksAlias.port
  };
  delete req.body.name;
  delete req.body.alias;
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

// 路由-查询
router.post('/node/network/routes/detail', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.getNetworkRoutesDetail, req.headers).then((response) => {
    res.json(response);
  })
});

// 路由-添加
router.post('/node/network/routes/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.addNetworkRoutes, req.headers).then((response) => {
    res.json(response);
  })
});
// 路由-修改
router.post('/node/network/routes/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.network.editNetworkRoutes, req.headers).then((response) => {
    res.json(response);
  })
});

// 路由-删除
router.post('/node/network/routes/delete', function (req, res, next) {
  const bondingUrl = {
    url: '/network/routes',
    method: nodeApi.network.deleteNetworkRoutes.method,
    port: nodeApi.network.deleteNetworkRoutes.port
  };
  ipRequest(req.body, bondingUrl, req.headers).then((response) => {
    res.json(response);
  })
});

module.exports = router;
