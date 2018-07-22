#!/bin/bash

#------------------ [01] 检测端口占用启动mongodb ------------------#
dbpath='./mongodb/data'
dblogpath='./mongodb/logs/'
dbhost='127.0.0.1'
port=27017

# 01 make dbpath
for path in "$dbpath" "$dblogpath"; do
  if [ ! -d "$path" ]
  then
    mkdir "$path" -p
  fi
done

# 02 start mongodb
echo "check mongodb $port"
grep_port=`netstat -tlpn | grep "\b$port\b"`

if [ -n "$grep_port" ]
then
  echo "----- $grep_port -----"
  echo "mongodb already started in port:$port"
else
  echo "trying to start mongodb service."

  mongod \
  --dbpath="$dbpath" \
  --logpath="$dblogpath/mongod.log" \
  --bind_ip="$dbhost" --logappend --quiet --journal --fork
fi

# 03 dbinit
mongo ./scripts/db-init\(mongo-shell\).js

# 04 chmod
sudo chmod 755 scripts/db-check.sh scripts/db-stop.sh

#------------------- [02] 启动pm2服务进程 --------------------#

# [node]param - NODE_ENV - 开发模式启动node
# [pm2]param - name - 应用名字
# [pm2]param - restart-delay - 应用重启相隔的最小延迟
# [pm2]param - service-name - 服务名
# [pm2]param - max-memory-restart - 超过内存限制后服务器重启
# [pm2]param - env - 开发模式启动pm2
# [node]param - mock - 启动模拟数据模块
# [node]param - mongo-session - 启动mongodb持久化数据存储
# [pm2]param - watch - 文件变化监听重启 -- Centos7虚拟机上会导致机器卡顿
# [pm2]param - ignore-watch - 忽略监听 -- Centos7虚拟机上会导致机器卡顿

# 停止之前的进程
pm2 delete node-express-react

NODE_ENV=development \
pm2 start ./bin/www.js \
--name "node-express-react" \
--watch \
--ignore-watch "public website/logs mongodb .git .atom" \
--restart-delay 1000 \
--service-name pm2-node \
--max-memory-restart 500M \
--env development \
-- mock mongo-session

# 控制台打印日志
pm2 logs