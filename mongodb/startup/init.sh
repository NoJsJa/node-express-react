#!/bin/bash
dirname=`pwd`
dbpath="$dirname/../data"
dblogpath="$dirname/../logs"

# # 路径存入文件
touch /etc/frontend
sed '/MongodbDir=/'d /etc/frontend -i
echo "MongodbDir=$dirname/.." >> /etc/frontend

# # 清理旧数据
rm "$dbpath" -rf
rm "$dblogpath" -rf

echo '>>> now registry mongodb.service ... '
# # 获取项目路径
cp "$dirname/mongodb" /etc/init.d -f
cd /etc/init.d
sudo chmod a+x mongodb
chkconfig --add mongodb
chkconfig mongodb on

echo "done."
