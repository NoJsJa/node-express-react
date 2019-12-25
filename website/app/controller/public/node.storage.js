const express = require('express');
const router = express.Router();
const { nodeApi } = ModuleLoader('system', 'node.api.js');


// 查询存储设备信息
router.post('/node/storage/info', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getStorage, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询SWAP信息
router.post('/node/storage/memory/swap', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getSWAP, req.headers).then((response) => {
    res.json(response);
  })
});

// 块设备查询
router.post('/node/storage/blockdev/info', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getBlockdevInfo, req.headers).then((response) => {
    res.json(response);
  })
});

// 预读值查询
router.post('/node/storage/blockdev/ra', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getBlockdevRa, req.headers).then((response) => {
    res.json(response);
  })
});

// 分区 - 预读值设置
router.post('/node/storage/partation/ra/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.editPartationRa, req.headers).then((response) => {
    res.json(response);
  })
});
// 卷 - 预读值设置
router.post('/node/storage/lvm/lv/ra/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.editLvmLvRa, req.headers).then((response) => {
    res.json(response);
  })
});

// 分区-查询
router.post('/node/storage/blockdev/partitions', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getPartition, req.headers).then((response) => {
    res.json(response);
  })
});

// 分区-创建
router.post('/node/storage/blockdev/partitions/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addBlockdevPartition, req.headers).then((response) => {
    res.json(response);
  })
});

// 分区-删除
router.post('/node/storage/blockdev/partitions/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteBlockdevPartition, req.headers).then((response) => {
    res.json(response);
  })
});

// 查询lvm信息
router.post('/node/storage/lvm', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getLvmInfo, req.headers).then((response) => {
    res.json(response);
  })
});

// pv-创建
router.post('/node/storage/lvm/pv/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addLvmPv, req.headers).then((response) => {
    res.json(response);
  })
});

// pv-扩容
router.post('/node/storage/lvm/pv/extend', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.extendLvmPv, req.headers).then((response) => {
    res.json(response);
  })
});

// pv-删除
router.post('/node/storage/lvm/pv/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteLvmPv, req.headers).then((response) => {
    res.json(response);
  })
});

// vg-创建
router.post('/node/storage/lvm/vg/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addLvmVg, req.headers).then((response) => {
    res.json(response);
  })
});

// vg-扩容
router.post('/node/storage/lvm/vg/extend', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.extendLvmVg, req.headers).then((response) => {
    res.json(response);
  })
});

// vg-重命名
router.post('/node/storage/lvm/vg/rename', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.renameLvmVg, req.headers).then((response) => {
    res.json(response);
  })
});

// vg-删除
router.post('/node/storage/lvm/vg/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteLvmVg, req.headers).then((response) => {
    res.json(response);
  })
});

// lv-创建
router.post('/node/storage/lvm/lv/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addLvmLv, req.headers).then((response) => {
    res.json(response);
  })
});

// lv-扩容
router.post('/node/storage/lvm/lv/extend', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.extendLvmLv, req.headers).then((response) => {
    res.json(response);
  })
});

// lv-重命名
router.post('/node/storage/lvm/lv/rename', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.renameLvmLv, req.headers).then((response) => {
    res.json(response);
  })
});

// lv-回滚
router.post('/node/storage/lvm/lv/rollback', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.snapshotLvmLv, req.headers).then((response) => {
    res.json(response);
  })
});

// lv-删除
router.post('/node/storage/lvm/snapshot/restore', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.restoreSnapshot, req.headers).then((response) => {
    res.json(response);
  })
});
// lv-快照回滚
router.post('/node/storage/lvm/lv/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteLvmLv, req.headers).then((response) => {
    res.json(response);
  })
});
// lv-启用
router.post('/node/storage/lvm/lv/activate', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.lvActivate, req.headers).then((response) => {
    res.json(response);
  })
});
// lv-停用
router.post('/node/storage/lvm/lv/deactivate', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.lvDeactivate, req.headers).then((response) => {
    res.json(response);
  })
});

// iscsi-扫描taerget
router.post('/node/storage/iscsi/initiator/targets/scanning', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getIscsiInitiatorTargets, req.headers).then((response) => {
    res.json(response);
  })
});
// iscsi-查询
router.post('/node/storage/iscsi/initiator', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getIscsiInitiator, req.headers).then((response) => {
    res.json(response);
  })
});
// iscsi-挂载/创建
router.post('/node/storage/iscsi/session/create', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.createIscsiSession, req.headers).then((response) => {
    res.json(response);
  })
});
// iscsi-卸载
router.post('/node/storage/iscsi/initiator/sessions', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteIscsiSession, req.headers).then((response) => {
    res.json(response);
  })
});

// iscsi-删除
router.post('/node/storage/iscsi/initiator/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteIscsi, req.headers).then((response) => {
    res.json(response);
  })
});

// iscsi-设置
router.post('/node/storage/iscsi/initiator/set', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setIscsi, req.headers).then((response) => {
    res.json(response);
  })
});

// iscsi-获取ip信息
router.post('/node/storage/iscsi/initiator/targets', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.discoverTargets, req.headers).then((response) => {
    res.json(response);
  })
});

// Local Fs-查询
router.post('/node/storage/fs/local/info', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getLocalFileSystemInfo, req.headers).then((response) => {
    res.json(response);
  })
});

// Local Fs-创建
router.post('/node/storage/fs/local/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addLocalFS, req.headers).then((response) => {
    res.json(response);
  })
});

// Local Fs-删除
router.post('/node/storage/fs/local/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteLocalFS, req.headers).then((response) => {
    res.json(response);
  })
});

// Local Fs-扩容
router.post('/node/storage/fs/local/expand', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.expandLocalFS, req.headers).then((response) => {
    res.json(response);
  })
});

// Network Fs & Infinity Fs-查询
router.post('/node/storage/fs/net/info', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getFileSystemInfo, req.headers).then((response) => {
    res.json(response);
  })
});

// Network Fs-创建NFS
router.post('/node/storage/fs/net/nfs/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addNFS, req.headers).then((response) => {
    res.json(response);
  })
})

// NFS Shares-查询
router.post('/node/storage/fs/net/nfs/exports', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getNfsShares, req.headers).then((response) => {
    res.json(response);
  })
})

// Network Fs-创建CIFS
router.post('/node/storage/fs/net/cifs/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addCIFS, req.headers).then((response) => {
    res.json(response);
  })
})

// CIFS Shares-查询
router.post('/node/storage/fs/net/cifs/shares', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getCifsShares, req.headers).then((response) => {
    res.json(response);
  })
})

// Infinity Fs-创建
router.post('/node/storage/fs/net/infinity/add', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addInfinityFs, req.headers).then((response) => {
    res.json(response);
  })
})

// Infinity Path-查询
router.post('/node/storage/fs/net/infinity/subdir', function (req, res, next) {
  let serverPara = '';
  let url;
  req.body.serverArr.map((ser) => {
    serverPara += '&server=' + ser;
  });
  serverPara = serverPara.substr(1);
  if (serverPara) {
    url = nodeApi.storage.getInfinitySubDir.url + '?' + serverPara;
  } else {
    url = nodeApi.storage.getInfinitySubDir.url;
  }
  delete req.body.serverArr;
  ipRequest(req.body, {
    url: url,
    method: nodeApi.storage.getInfinitySubDir.method,
    port: nodeApi.storage.getInfinitySubDir.port,
  }, req.headers).then((response) => {
    res.json(response);
  })
})

// Network Fs & Infinity Fs-删除
router.post('/node/storage/fs/net/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteFileSystem, req.headers).then((response) => {
    res.json(response);
  })
})

// Fs-卸载
router.post('/node/storage/fs/mounts/unmount', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.unmountFileSystem, req.headers).then((response) => {
    res.json(response);
  })
})

// Fs-挂载
router.post('/node/storage/fs/mounts/mount', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.mountFileSystem, req.headers).then((response) => {
    res.json(response);
  })
})

// Fs-挂载设置
router.post('/node/storage/fs/automount', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.editAutomount, req.headers).then((response) => {
    res.json(response);
  })
})

// Fs-获取子目录
router.post('/node/storage/file/subdir', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getFileSubDir, req.headers).then((response) => {
    res.json(response);
  })
})

// Raid-查询
router.post('/node/storage/raids', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getraidsList, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-创建
router.post('/node/storage/raid', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addRaid, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-扩容
router.post('/node/storage/raids/extend', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.extendRaid, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-删除
router.post('/node/storage/raids/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteRaid, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-设置读写缓存
router.post('/node/storage/raid/cache', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setReadWriteCacheRAID, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-设置读缓存
router.post('/node/storage/raid/cache/read', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setReadCacheRAID, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-设置写缓存
router.post('/node/storage/raid/cache/write', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setWriteCacheRAID, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-开始校验
router.post('/node/storage/raid/check/start', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.startRaidCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-停止校验
router.post('/node/storage/raid/check/stop', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.stopRaidCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-获取定时校验
router.post('/node/storage/raid/check/schedule', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.retrieveRaidCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-设置定时校验
router.post('/node/storage/raid/check/schedule/set', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setRaidCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-取消定时校验
router.post('/node/storage/raid/check/schedule/disable', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.disableRaidCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-获取下次执行时间
router.post('/node/storage/raid/schedule/next', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getRaidNextTime, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-获取当前任务task
router.post('/node/storage/raid/check', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getRaidTask, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-获取缓存任务
router.post('/node/storage/raid/ssdcache/task', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.retrieveSSDCacheTask, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-开始缓存任务
router.post('/node/storage/raid/ssdcache/check/start', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.startSSDCacheCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-停止缓存任务
router.post('/node/storage/raid/ssdcache/check/stop', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.stopSSDCacheCheck, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-修改名字
router.post('/node/storage/raids/edit', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.editRaidName, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-创建缓存raid
router.post('/node/storage/raid/ssdcache/create', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.createCacheRAID, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-删除缓存raid
router.post('/node/storage/raid/ssdcache/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.deleteCacheRAID, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-设置SSD读缓存
router.post('/node/storage/raid/ssdcache/read', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setSSDReadCache, req.headers).then((response) => {
    res.json(response);
  })
});

// Raid-设置SSD写缓存
router.post('/node/storage/raid/ssdcache/write', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setSSDWriteCache, req.headers).then((response) => {
    res.json(response);
  })
});

// controllers-查询
router.post('/node/storage/disk/controllers', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getControllers, req.headers).then((response) => {
    res.json(response);
  })
});
// disks -scan 查询
router.post('/node/storage/disks/scan', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.scanDisks, req.headers).then((response) => {
    res.json(response);
  })
});
// disk-查询
router.post('/node/storage/disks', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.retrieveDisks, req.headers).then((response) => {
    res.json(response);
  })
});
// available_disk-查询
router.post('/node/storage/disk/available', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.retrieveAvailableDisks, req.headers).then((response) => {
    res.json(response);
  })
});
// enclosure-查询
router.post('/node/storage/enclosure/config', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.getEnclosure, req.headers).then((response) => {
    res.json(response);
  })
});
// enclosure-设置
router.post('/node/storage/enclosure/config/set', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.setEnclosure, req.headers).then((response) => {
    res.json(response);
  })
});
// disk-初始化
router.post('/node/storage/disks/initialize', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.initializeDisk, req.headers).then((response) => {
    res.json(response);
  })
});
// disk-开启SMART 
router.post('/node/storage/disk/smart', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.enableSmart, req.headers).then((response) => {
    res.json(response);
  })
});
// hostSpare-创建
router.post('/node/storage/raid/hotspare/create', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.addHostSpare, req.headers).then((response) => {
    res.json(response);
  })
});

// hostSpare-删除
router.post('/node/storage/raid/hotspare/delete', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.hostSpareDelete, req.headers).then((response) => {
    res.json(response);
  })
});

// hostSpare-编辑
router.post('/node/storage/raid/hotspare/modify', function (req, res, next) {
  ipRequest(req.body, nodeApi.storage.modifyHostSpare, req.headers).then((response) => {
    res.json(response);
  })
});

module.exports = router;
