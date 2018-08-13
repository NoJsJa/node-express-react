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

# # 可执行权限
sudo chmod 755 "$dirname/node-express-react/pm2.dev.sh"
sudo chmod 755 "$dirname/node-express-react/pm2.prod.sh"
sudo chmod 755 "$dirname/node-express-react/scripts/frontend"

# # 停止前端系统服务
stopPm2() {
  echo '>>> now kill pm2.service ... '
  for pnumber in `pgrep PM2`
  do
    kill -3 $pnumber
  done
}

# # 注册全局变量
if [ -z `grep 'FrontEndDir' /etc/bashrc` ]; then
  sudo echo "export FrontEndDir=$dirname/node-express-react" >> /etc/bashrc
  source /etc/bashrc
fi

# # 删除旧数据
rm "$node" -rf
rm "$mongodb" -rf

# # 解压安装node环境并加入系统变量
echo '>>> now install nodejs.package ... '
tar -xf "$node.gzip"
for biname in `ls $dirname/$node/bin`
do
  sudo ln -s "$dirname/$node/bin/$biname" /usr/bin -f
done

# # 设置npm镜像源为国内镜像
npm config set registry https://registry.npm.taobao.org

# # 解压安装mongodb环境并加入系统变量
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
iptables -I INPUT -p tcp --dport $webport -j ACCEPT
iptables -I INPUT -p tcp --dport $dbport -j ACCEPT
iptables -I OUTPUT -p tcp --dport $webport -j ACCEPT
iptables -I OUTPUT -p tcp --dport $dbport -j ACCEPT

# # 自定义前端服务自启动启动脚本
echo '>>> now registry frontend.service  ... '
cp "$dirname/node-express-react/scripts/frontend" /etc/init.d -f
cd /etc/init.d
sudo chmod a+x frontend
chkconfig --add frontend
chkconfig frontend on

# # 停止之前的服务
bash "$dirname/node-express-react/scripts/frontend" stop

# # 进入项目并启动生产环境
cd "$dirname/node-express-react"

# # 停止前端systemd服务
stopPm2

# # 开启前端服务
rm mongodb/data -rf
bash pm2.prod.sh
