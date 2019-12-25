const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');

// CPU利用率-整体
router.post('/node/statistical/cpu/overall', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const iowaitReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const irqReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const niceReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const softirqReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const stealReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const systemReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const userReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const getUrl = (query) => {
    return {
      url: nodeApi.statistical.getStatisCommon.url + '?query=hms:cpu:utilization:' + query + '&start=' + startTime + '&end=' + endTime + '&step=' + step,
      method: nodeApi.statistical.getStatisCommon.method,
      port: nodeApi.statistical.getStatisCommon.port,
    };
  };
  const modeRequest = (req, mode) => {
    return ipRequest({ _ip: req._ip }, getUrl(mode), req.headers).then((response) => {
      if (response.status === 'success' && response.data.result.length > 0) {
        response.data.result[0].name = mode;
      }
      return response;
    });
  }
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  Promise.all([
    modeRequest(iowaitReq, 'iowait'),
    modeRequest(irqReq, 'irq'),
    modeRequest(niceReq, 'nice'),
    modeRequest(softirqReq, 'softirq'),
    modeRequest(stealReq, 'steal'),
    modeRequest(systemReq, 'system'),
    modeRequest(userReq, 'user'),
  ]).then((resp) => {
    const dataArr = [];
    resp.map((item) => {
      if (item.status === 'success' && item.data.result.length > 0) {
        // 填补没有的数据值为--
        const itemValues = item.data.result[0].values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.data.result[0].values = tempItemArr;

        dataArr.push(item.data.result[0]);
      }
    });
    res.json({
      status: 'success',
      data: {
        result: dataArr,
        resultType: 'matrix',
      }
    });
  })
});

// CPU利用率-各核
router.post('/node/statistical/cpu/nuclears', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success') {
      const result = (response.data.result).reduce((initArray, item) => {
        const initArr = initArray;
        const itemData = item;
        const index = `CPU${item.metric.cpu}`;
        itemData.name = item.metric.mode;
        itemData.cpukey = index;

        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        itemData.values = tempItemArr;

        if (initArr[index]) {
          initArr[index].push(itemData);
        } else {
          initArr[index] = [itemData];
        }
        return initArr;
      }, []);
      const cpuArr = [];
      Object.keys(result).forEach((key) => {
        cpuArr.push(result[key]);
      });
      res.json({
        status: response.status,
        data: {
          result: cpuArr,
          resultType: response.data.resultType,
        }
      })
    } else {
      res.json(response);
    }
  })
});

// 内存利用率
router.post('/node/statistical/ram/utilization', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const swapUsedReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const swapFreeReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const usedReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const sharedReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const buffersReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const cacheReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const freeReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const availableReq = Object.assign({}, { _ip: req.body._ip }, { headers: req.headers });
  const getUrl = (query) => {
    return {
      url: nodeApi.statistical.getStatisCommon.url + '?query=hms:memory:' + query + '&start=' + startTime + '&end=' + endTime + '&step=' + step,
      method: nodeApi.statistical.getStatisCommon.method,
      port: nodeApi.statistical.getStatisCommon.port,
    }
  }
  const modeRequest = (req, mode) => {
    return ipRequest({ _ip: req._ip }, getUrl(mode), req.headers).then((response) => {
      if (response.status === 'success' && response.data.result.length > 0) {
        response.data.result[0].name = mode;
      }
      return response;
    });
  }
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  Promise.all([
    modeRequest(swapUsedReq, 'swap:used'),
    modeRequest(swapFreeReq, 'swap:free'),
    modeRequest(usedReq, 'used'),
    modeRequest(sharedReq, 'shared'),
    modeRequest(buffersReq, 'buffers'),
    modeRequest(cacheReq, 'cache'),
    modeRequest(freeReq, 'free'),
    modeRequest(availableReq, 'available'),
  ]).then(resp => {
    const dataArr = [];
    resp.map((item) => {
      if (item.status === 'success' && item.data.result.length > 0) {
        // 填补没有的数据值为--
        const itemValues = item.data.result[0].values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.data.result[0].values = tempItemArr;
      
        dataArr.push(item.data.result[0]);
      }
    });
    res.json({
      status: 'success',
      data: {
        result: dataArr,
        resultType: 'matrix',
      }
    });
  })
});

// 存储带宽-磁盘利用率
router.post('/node/statistical/disk/utilization', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// 存储带宽-读
router.post('/node/statistical/disk/read/rate', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// 存储带宽-写
router.post('/node/statistical/disk/write/rate', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// IOPS-读
router.post('/node/statistical/read/iops', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// IOPS-写
router.post('/node/statistical/write/iops', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// 网络带宽-收包
router.post('/node/statistical/network/receive/pps', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// 网络带宽-发包
router.post('/node/statistical/network/transmit/pps', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// 网络收发包率-收包率
router.post('/node/statistical/network/receive/rate', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});

// 网络收发包率-发包率
router.post('/node/statistical/network/transmit/rate', function (req, res, next) {
  const startTime = req.body.start;
  const endTime = req.body.end;
  const step = req.body.step;
  const count = Math.max(Math.floor((endTime - startTime) / step), 1); // 返回点的个数
  const url = {
    url: nodeApi.statistical.getStatisCommon.url + '?query=' + req.body.query + '&start=' + req.body.start + '&end=' + req.body.end + '&step=' + req.body.step,
    method: nodeApi.statistical.getStatisCommon.method,
    port: nodeApi.statistical.getStatisCommon.port,
  };
  delete req.body.query;
  delete req.body.start;
  delete req.body.end;
  delete req.body.step;
  ipRequest(req.body, url, req.headers).then((response) => {
    if (response.status === 'success' && response.data.result.length > 0) {
      response.data.result.map((item) => {
        // 填补没有的数据值为--
        const itemValues = item.values;
        const tempItemArr = [];
        for (let i = 0; i < count; i++) {
          const timestamp = startTime + (step * i);
          tempItemArr[i] = [timestamp, '--'];
        }
        for (let k = 0; k < itemValues.length; k++) {
          const key = Math.round((itemValues[k][0] - startTime) / step);
          tempItemArr[key] = itemValues[k];
        }
        item.values = tempItemArr;
      });
    }
    res.json(response);
  })
});


module.exports = router;