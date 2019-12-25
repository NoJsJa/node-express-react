#!/bin/bash
# run this script in root path

#------------------- init bash env and start mongodb --------------------#

# # 获取声明的全局系统变量
getPath() {
  # var -- FrontEndDir
  for var in `cat /etc/frontend`; do
    a=`echo $var | awk -F '=' '{print $1}'`
    b=`echo $var | awk -F '=' '{print $2}'`
    export $a=$b
  done
  if [ -z $FrontEndDir ] ; then
    echo ">>> get default FrontEndDir ... "
    FrontEndDir=/opt/allweb/node-express-react
  fi
}

getPath
dbpath="$FrontEndDir/mongodb/data"
dblogpath="$FrontEndDir/mongodb/logs/"
dbhost='0.0.0.0'
port=27017

# 01 make dbpath
mkdir "$dbpath" -p
mkdir "$dblogpath" -p

# 02 start mongodb
# echo ">>> now check mongodb $port"
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

# 04 chmod
# sudo chmod 755 $FrontEndDir/mongodb/db-check.sh
# sudo chmod 755 $FrontEndDir/mongodb/db-stop.sh

#------------------- start pm2 service --------------------#

# [node]param - NODE_ENV - 开发模式启动node
# [pm2]param - i - 需要启动的实例数量 -- Centos7 虚拟机下面不能开集群模式
# [pm2]param - name - 应用名字
# [pm2]param - restart-delay - 应用重启相隔的最小延迟
# [pm2]param - service-name - 服务名
# [pm2]param - max-memory-restart - 超过内存限制后服务器重启
# [pm2]param - max-restarts - 最大重启次数
# [pm2]param - env - 开发模式启动pm2
# [node]param - mock - 启动模拟数据模块
# [node]param - mongo-session - 启动mongodb持久化数据存储
# [pm2]param - watch - 文件变化监听重启 -- Centos7 虚拟机下面不能开集群模式
# [pm2]param - ignore-watch - 忽略监听 -- Centos7 虚拟机下面不能开集群模式

# stop node process before
pm2 delete node-express-react

cd $FrontEndDir

# NODE_ENV=production node ./bin/www.js mongo-session mongo-disable

NODE_ENV=production \
pm2 start $FrontEndDir/bin/www.js \
--name "node-express-react" \
--restart-delay 1000 \
--service-name pm2-node \
--max-memory-restart 500M \
--max-restarts 10 \
--env production \
-- mongo-session mongo-disable

# logs
pm2 logs
