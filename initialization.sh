#!/bin/bash

cd ..

# # 变量
# - - 当前目录
# - - mongodb文件名
# - - node文件名
dirname=`pwd`
mongodb=mongodb-linux-x86_64-rhel70-3.6.4
node=node-v8.11.1-linux-x64
webport=3000
dbport=27017

# # 删除旧数据
rm "$node" -rf
rm "$mongodb" -rf

# # 解压安装node环境并加入系统变量
tar -xvf "$node.gzip"
for biname in `ls $dirname/$node/bin`
do
  sudo ln -s "$dirname/$node/bin/$biname" /usr/bin -f
done

# # 设置npm镜像源为国内镜像
npm config set registry https://registry.npm.taobao.org

# # 解压安装mongodb环境并加入系统变量
tar -xvf "$mongodb.tgz"
for biname in `ls $dirname/$mongodb/bin`
do
  sudo ln -s "$dirname/$mongodb/bin/$biname" /usr/bin -f
done

# # 防火墙开启 3000(node) / 27017(mongodb) 端口并重启
firewall-cmd --zone=public --add-port=$webport/tcp --permanent
firewall-cmd --zone=public --add-port=$dbport/tcp --permanent
firewall-cmd --reload
# # iptables开放端口3000和27017的规则
iptables -I INPUT -p tcp --dport $webport -j ACCEPT
iptables -I INPUT -p tcp --dport $dbport -j ACCEPT
iptables -I OUTPUT -p tcp --dport $webport -j ACCEPT
iptables -I OUTPUT -p tcp --dport $dbport -j ACCEPT

# 将前端服务写入开机自启动命令 -- refused
# if [ -z `grep 'frontend-service' /etc/rc.d/rc.local` ] ; then
#   echo '## frontend-service restart' >> /etc/rc.d/rc.local;
#   echo 'pm2.prod.sh /opt/infinity/node-express-react/' >> /etc/rc.d/rc.local
# fi
# sudo chmod a+x /etc/rc.d/rc.local

# # 自定义前端服务自启动启动脚本
cp node-express-react/scripts/frontend /etc/init.d -f
cd /etc/init.d
sudo chmod a+x frontend
chkconfig --add frontend
chkconfig frontend on

# # 停止之前的服务
bash scripts/frontend stop

# # 进入项目并启动生产环境
cd "$dirname/node-express-react"
rm mongodb/data -rf
sudo chmod 755 pm2.dev.sh pm2.prod.sh
bash pm2.prod.sh
