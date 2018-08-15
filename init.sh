#!/bin/bash

cd ..

# # 局部变量
# - - 当前目录
# - - mongodb文件名
# - - node文件名
# - - web端口
# - - mongodb数据库端口
dirname=`pwd`
mongodb=mongodb-linux-x86_64-rhel70-3.6.4
node=node-v8.11.1-linux-x64
webport=3000
dbport=27017

# # 注册全局变量
# - - FrontEndDir -- 前端代码路径
sed '/export FrontEndDir=/'d /etc/profile -i
sudo echo "export FrontEndDir=$dirname/node-express-react" >> /etc/profile
source /etc/profile
# # 存入文件
rm /etc/frontend -f
touch /etc/frontend
echo "FrontEndDir=$dirname/node-express-react" >> /etc/frontend

# # 删除旧数据
rm "$node" -rf
rm "$mongodb" -rf
rm "$FrontEndDir/mongodb/data" -rf

# # 可执行权限
sudo chmod 755 "$FrontEndDir/pm2.dev.sh"
sudo chmod 755 "$FrontEndDir/pm2.prod.sh"
sudo chmod 755 "$FrontEndDir/scripts/frontend"

# # 停止前端系统服务
stopPm2() {
  echo '>>> now kill pm2.service ... '
  for pnumber in `pgrep PM2`
  do
    kill -3 $pnumber
  done
}

# # 前端服务注册(old)
registryFrontendService1() {
  echo '>>> now registry frontend.service  ... '
  cp "$FrontEndDir/scripts/frontend" /etc/init.d -f
  cd /etc/init.d
  sudo chmod a+x frontend
  chkconfig --add frontend
  chkconfig frontend on
}

# # 前端服务注册(new)
registryFrontendService2() {
  echo '>>> now registry frontend.service  ... '
  cp $FrontEndDir/scripts/startup/frontend.service /usr/lib/systemd/system/ -f
  systemctl daemon-reload
  systemctl enable frontend.service
}

# # 解压node二进制包并加入系统变量
echo '>>> now install nodejs.package ... '
tar -xf "$node.gzip"
for biname in `ls $dirname/$node/bin`
do
  sudo ln -s "$dirname/$node/bin/$biname" /usr/bin -f
done

# # 设置npm镜像源为国内镜像
npm config set registry https://registry.npm.taobao.org

# # 解压mongodb二进制包并加入系统变量
echo '>>> now install mongodb.package ... '
tar -xf "$mongodb.tgz"
for biname in `ls $dirname/$mongodb/bin`
do
  sudo ln -s "$dirname/$mongodb/bin/$biname" /usr/bin -f
done

# # 防火墙开启 3000(node) / 27017(mongodb) 端口并重启
echo '>>> now configure firewall ... '
firewall-cmd --zone=public --add-port=$webport/tcp --permanent
firewall-cmd --zone=public --add-port=$dbport/tcp --permanent
firewall-cmd --reload

# # iptables开放端口3000和27017的规则
echo '>>> now configure iptables ... '
iptables -I INPUT -p tcp --dport $webport -j ACCEPT
iptables -I INPUT -p tcp --dport $dbport -j ACCEPT
iptables -I OUTPUT -p tcp --dport $webport -j ACCEPT
iptables -I OUTPUT -p tcp --dport $dbport -j ACCEPT

# # 自定义前端服务自启动启动脚本
registryFrontendService1

# # 进入项目并启动生产环境
cd "$FrontEndDir"

# # 停止之前的服务
bash "scripts/frontend" stop

# # 停止前端systemd服务
stopPm2

# # 开启前端生产环境
bash pm2.prod.sh
