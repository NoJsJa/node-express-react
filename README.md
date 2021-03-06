### node-express-react
>测试环境: node v8.11.1 | npm v5.6.0 | express v4.16.0 | Centos7.4 | mongodb v3.4

#### Contents
-------------
1. Instruction
2. Commands
3. Catalog & Files
4. Configuration & Startup

#### Instruction
----------------

> 基本说明  

作为调用后台API的node中间服务层，除此之外还包含：用户登录管理、用户session管理、访问权限控制、访问日志记录、资源国际化(language设置)、前端静态文件托管、基本服务配置和启动、服务进程负载均衡。

> 生产环境 & 开发环境  

开发环境下服务的启动是通过shell脚本[pm2.dev.sh]手动启动的，第一次启动之前需要执行shell脚本[init.sh]进行初始化(注意需要在脚本父文件夹同级目录下存放mongodb和node.js的压缩包文件)，初始化后node.js进程由pm2进程管理器管理，可以实现更新热加载和无缝重启；生产环境下是通过systemd服务管理的(服务启动脚本pm2.prod.sh)，用于生产环境下的开机自启和服务注册，生产环境下不能热加载代码，因此不能用于开发工作，可以先使用systemctl命令停止服务然后运行启动pm2.dev.sh开发环境脚本启动开发环境。

> 全局变量  

* ModuleLoader -- [function] -- 模块加载器
* \_path -- [object] -- 全局文件绝对路径
* pm2 -- [Application] -- node进程管理器
* lang -- [object] -- 当前载入的语言数据
* LANG -- [string] -- 当前语言数据标识(en_us, zh_cn)

#### Commands
------------
命令速查:
1. 系统前端管理服务`frontend`
```sh
# 查看前端服务状态
$: systemctl status frontend
# 启动前端服务
$: systemctl start frontend
# 停止前端服务
$: systemctl stop frontend
```
2. pm2管理命令
```sh
# 查看pm2运行日志
$: pm2 logs
# 列举所有pm2管理的node进程
$: pm2 list all
# 启动所有pm2管理的node进程
$: pm2 start all
# 启动某个pm2管理的node进程
$: pm2 start [id]
# 重载某个pm2管理的node进程
$: pm2 reload [id]
# 停止所有pm2管理的node进程
$: pm2 stop all
# 启动某个pm2管理的node进程
$: pm2 stop [id]
# 删除所有pm2管理的node进程
$: pm2 delete all
# 删除某个pm2管理的node进程
$: pm2 delete [id]
```

#### Catalog & Files
-------------------
> 目录和文件说明  

[file] init.sh -- centos7虚拟机 前端服务部署脚本  
[file] pm2.dev.sh -- 项目开发环境启动脚本  
[file] pm2.prod.sh -- 项目生产环境启动脚本  
[file] app.js -- express 实例全局配置 和 中间件引入  
[file] package.json -- 项目基本信息和依赖包管理  

[dir ] bin -- node服务启动文件目录  
[dir ] views -- 前端部分页面模板文件  

[dir ] mongodb -- mongodb数据库目录  
[file] ..... mongodb/db-init(mongo-shell).js -- mongodb初始化  
[file] ..... mongodb/db-rename(mongo-shell).js -- mongodb重命名数据库  
[file] ..... mongodb/db-stop.sh -- 关闭mongodb进程服务  
[file] ..... mongodb/db-check.sh -- 检查mongodb进程状态  
[dir ] ..... mongodb/startup -- mongodb脚本目录  
[file] .......... mongodb/startup/init.sh -- mongodb安装初始化脚本  
[file] .......... mongodb/startup/mongodb -- mongodb开机自启动脚本  

[dir ] public -- 前端文件存储目录  
[dir ] ..... public/public -- 前端自定义文件托管目录  

[dir ] ..... public/dist -- webpack自动生成静态文件托管目录  
[dir ] .......... public/dist/images -- 图片目录  
[dir ] .......... public/dist/js -- js文件目录  
[dir ] .......... public/dist/styles -- 样式表目录  
[file] .......... public/dist/index.html -- 入口页面  
[file] .......... public/dist/index.js -- webpack打包的bundle文件  

[dir ] scripts -- mongodb相关的脚本  
[file] ..... scripts/frontend -- 前端chkconfig服务注册脚本  
[dir ] ..... scripts/startup -- 前端systemctl服务注册脚本  
[file] .......... scripts/startup/frontend.service -- 前端systemctl服务注册脚本  

[dir ] website -- 项目主代码目录  
[dir ] ..... website/app -- MAIN 该目录下创建的文件夹会被自动记入路径映射   
[dir ] .......... website/app/controller -- 控制器  
[dir ] .......... website/app/inspector -- 拦截器  
[dir ] .......... website/app/middleware -- 自定义中间件  
[dir ] .......... website/app/mock -- mock模拟API  
[dir ] .......... website/app/model -- model接口调用  
[dir ] ..... website/lang -- 语言配置文件目录  
[dir ] .......... website/lang/en_us -- 英语  
[dir ] .......... website/lang/zh_cn -- 大陆/简体中文  
[dir ] .......... website/lang/zh_tw -- 台湾/繁体中文  
[dir ] ..... website/logs -- 服务日志  
[file] .......... website/logs/error.txt -- pm2错误日志  
[file] .......... website/logs/mongod.log -- mongodb运行日志  
[dir ] ..... website/system -- 系统配置文件  
[file] .......... website/system/app.config.js -- 全局配置文件  
[file] .......... website/system/dtprec.js -- 请求接口配置文件  
[file] .......... website/system/mongo.config.js -- mongodb连接配置文件  
[dir ] ..... website/utils -- 工具函数  
[file] .......... website/utils/MongoConnnect.js -- mongoose连接池初始化  
[file] .......... website/utils/Request.js -- axios请求处理实例  
[file] .......... website/utils/Utils.js -- 工具函数  

#### Module Details & Usage
---------------------------
> 模块细节和使用说明  

1. 模块载入公用方法
```js
  /* pattern */
  /*
   * 已经记入路径映射下的路径
   * controller.hyhive => path/to/controller/hyhive
   * controller.infinity => path/to/controll/infinity
   * controller.public => path/to/controller/public
   * model.hyhive => path/to/model/hyhive
   * model.infinity => path/to/model/infinity
   * model.public => path/to/model/public
   * mock.hyhive => path/to/mock/hyhive
   * mock.infinity => path/to/mock/infinity
   * mock.public => path/to/mock/public
   * mock => path/to/mock
   * middleware => path/to/website/app/middleware
   * inspector => path/to/website/app/inspector
   * utils => path/to/website/utils
   * system => path/to/website/system
   * lang => path/to/website/lang
   * scripts => path/to/scripts
   * mongodb => path/to/mongodb
   * dist => path/to/public/dist
   */
  ModuleLoader(path_to_module, file_name);
  /* demo */
  ModuleLoader('controller.public', 'index.controller.js');
  ModuleLoader('utils', 'Request.js');
```

2. 模块目录和文件命名区分  
某些模块分为infinity项目和hyhive项目的独立文件夹: controller、model、mock  
某些目录下的文件命名要对hyhive项目和infinity项目进行区分: 请注意lang目录下的的语言文件命名  
某些模块需要根据模块功能进行命名体现：controller、model、mock -- xxx.controller.js、xxx.model.js、xxx.mock.js  

3. 语言文件说明  
语言文件位于lang目录下，分为简体中文(zh_ch)、繁体中文(zh_tw)、英文(en_us)，每个语言目录下的文件要做前缀命名区分：infinity_module1.js、hyhive_module1.js  

4. 接口请求配置文件说明  
infinity接口配置  -- website/system/infinity.api.js  
hyhive接口配置  -- website/system/hyhive.api.js  
public接口配置  -- website/system/public.api.js  

#### Configuration & Startup
---------------------------
> 项目配置和启动参数  

* 综述：项目采用pm2进程管理器进行启动，同时pm2支持：监听指定的目录和文件变动自动重启node进程、cluster模式下多个node运行实例的负载均衡管理、服务运行日志处理、node进程监控面板，并且采用了mongodb 和 mongoose池进行持久化session处理。  

* 启动流程说明: 首先需要将 `mongodb-linux-x86_64-rhel70-3.6.4.tgz、node-v8.11.1-linux-x64.gzip、node-express-react.tar.gz` 传输到指定的服务器的同级目录下，然后解压 node-express-react.tar.gz 启动安装脚本`init.sh`，安装好之后会自动启动生产环境(pm2.prod.sh)，生产环境下没有代码热更新功能，如果更新了node.js的代码，需要手动到服务器上执行 `pm2 restart node-express-react` ，开发者如果要启动开发环境则需要进入代码目录执行 `bash pm2.dev.sh`，开发环境下可以代码热更新，并且会自动开启日志信息打印。 一般 `pm2.prod.sh/pm2.dev.sh` 只用启动一次就行，启动之后前端进程的管理是通过pm2进程管理器来管理的，可以自己查看一下pm2命令，以下会有说明。  
* 值得注意的是 服务器在重启之后 通过chkconfig注册的前端服务`frontend`会自动启动，但是是以`linux service`的形式启动的，此模式下不能用于开发者开发，因为不能使用pm2的命令和功能，一般用于生产环境，这个情况下要启动开发环境需要先关闭`frontend`服务 `service frontend stop`(开启服务 `systemctl start frontend`)，然后进入到前端代码目录手动执行相关的脚本文件(`bash pm2.dev.sh/pm2.prod.sh`)。

配置步骤如下:  

1. Centos7虚拟机前端服务部署 - 部署之后才能执行以下步骤
```sh
# * 可能需要赋予执行权限 sudo chmod 755 init.sh
# * 脚本将安装nodejs-v8、npm-v5、mongodb-v3、pm2进程管理工具，并将相关的可执行文件加入环境变量，最后将自动运行前端服务并监听文件变化
# > 注意请在上一级目录存放前端环境安装包(node-v8.11.1-linux-x64.tar.xz / mongodb-linux-x86_64-3.4.15.tgz)
$: bash init.sh
```

2. 开发环境启动
```sh
# * 可能需要赋予执行权限 sudo chmod 755 pm2.dev.sh
# * 开发环境下控制台会有日志打印信息，pm2监听文件变化重启node进程时不会重启mongodb数据库服务
$: bash pm2.dev.sh
```

3. 生产环境启动
```sh
# * 可能需要赋予执行权限 sudo chmod 755 pm2.prod.sh
# * 生产环境下控制台不会直接在控制台打印日志，pm2监听文件变化重启node进程时会重启mongodb数据库服务
$: bash pm2.prod.sh
```

4. 自定义启动
```sh
# * 可选参数1 - mock -- 启用模拟路由
# * 可选参数2 - mongo-session -- 启动mongodb持久化session数据
# > 注意：使用mongo-session时是否已经启动了mongodb数据库
#
# [01] 使用pm2启动 #
$: NODE_ENV=development pm2 start ./bin/www.js --watch -- mock mongo-session
#
# [02] 使用node直接启动 #
$: NODE_ENV=development node ./bin/www.js mongo-session mock
#
# [03] 使用Express Debug模式启动 #
$: DEBUG=express:* ./bin/www.js mock mongo-session
```

5. `frontend`开机自启动服务  
前端服务使用systemd注册为开机服务，
重启或是从关机状态启动后，前端服务frontend会自动在后台启动
```sh
# * 查看前端服务frontend状态
# * 此时pm2命令不可用于管理前端服务
$: systemctl status frontend
$: pm2 status
#
# 如果开发者需要从这个状态进入开发环境进行代码更新并开启代码热重载功能
# * 需要先手动关闭后台的frontend服务
# * 然后再进入前端代码目录，手动启动相关脚本
$: service frontend stop
$: cd /opt/dview/node-express-react
$: bash pm2.dev.sh
$: pm2 status
#
# ! 注意: 使用systemctl命令是通过系统服务命令管理，主要目的是用于开启自启。
# ! 注意: 开发阶段最好使用pm2管理，具有灵活性。
$: systemctl status frontend # 查看服务状态
$: systemctl start frontend # 启动服务
$: systemctl stop frontend # 停止服务
```

6. pm2启动node进程
```sh
# [01] 开启所有pm2 node 实例
$: pm2 start all
#
# [02] 开启指定的 pm2 node 实例
$: pm2 list
$: pm2 start [id]
#
# [03] 重启 pm2 node 实例
$: pm2 reload [id]
#
# [04] 查看日志信息
$: pm2 logs
```

7. pm2停止node进程
```sh
# [01] 停止所有pm2 node 实例
$: pm2 stop all
#
# [02] 停止指定的 pm2 node 实例
$: pm2 list
$: pm2 stop [id]
```

8. pm2删除node实例
```sh
# * 当你使用pm2启动node进程后，有时候需要重新设置node启动参数重启进程，
# * 那么就要先删除当前pm2 node 实例  
#
# [01] 删除所有pm2 node 实例
$: pm2 delete all
#
# [02] 删除指定的 pm2 node 实例
$: pm2 list
$: pm2 delete [id]
```
