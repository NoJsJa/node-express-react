#!/bin/bash
# run this script in root path

#------------------- init bash env and start mongodb --------------------#

# # parse global variable
getPath() {
  # var -- FrontEndDir
  for var in `cat /etc/frontend`; do
    a=`echo $var | awk -F '=' '{print $1}'`
    b=`echo $var | awk -F '=' '{print $2}'`
    export $a=$b
  done
  if [ -z $FrontEndDir ] ; then
    echo ">>> set default FrontEndDir ... "
    FrontEndDir=/opt/allweb/node-express-react
  fi
}

getPath
FrontEndDir=`pwd`
dbpath="$FrontEndDir/mongodb/data"
dblogpath="$FrontEndDir/mongodb/logs/"
dbhost='0.0.0.0'
port=27017

# 01 make dbpath
mkdir "$dbpath" -p
mkdir "$dblogpath" -p

# 02 start mongodb
# echo ">>> now check mongodb $port..."
# grep_port=`netstat -tlpn | grep "\b$port\b"`
#
# if [ -n "$grep_port" ]
# then
#   echo ">>> mongodb already started in port:$port ... "
# else
#   echo ">>> trying to start mongodb service ... "
#
#   mongod \
#   --dbpath="$dbpath" \
#   --logpath="$dblogpath/mongod.log" \
#   --bind_ip="$dbhost" --logappend --quiet --journal --fork
# fi

# 03 dbinit
# mongo $FrontEndDir/mongodb/db-init\(mongo-shell\).js

# 04 chmod file
# sudo chmod 755 $FrontEndDir/mongodb/db-check.sh
# sudo chmod 755 $FrontEndDir/mongodb/db-stop.sh

#------------------- start pm2 service --------------------#

# [node] param - NODE_ENV - 开发模式启动node
# [pm2 ] param - name - 应用名字
# [pm2 ] param - restart-delay - 应用重启相隔的最小延迟
# [pm2 ] param - service-name - 服务名
# [pm2 ] param - max-memory-restart - 超过内存限制后服务器重启
# [pm2 ] param - env - 开发模式启动pm2
# [node] param - mock - 启动模拟数据模块
# [node] param - mongo-session - 启动mongodb持久化数据存储
# [pm2 ] param - watch - 文件变化监听重启 -- Centos7虚拟机上会导致机器卡顿
# [pm2 ] param - ignore-watch - 忽略监听 -- Centos7虚拟机上会导致机器卡顿

# stop node process before
pm2 delete node-express-react
systemctl stop frontend

cd $FrontEndDir

NODE_ENV=development \
pm2 start $FrontEndDir/bin/www.js \
--name "node-express-react" \
--watch \
--ignore-watch "public website/logs mongodb node_modules .git .atom" \
--restart-delay 1000 \
--service-name pm2-node \
--max-memory-restart 500M \
--env development \
-- mock mongo-session mongo-disable

# show console dev logs
pm2 logs
