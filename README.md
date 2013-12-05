# 修改记录
------------------
## Management

### 修复

1.ie9,10 project,candidate,user下 增删  无效 (2013.11.25)
2.如果添加项目,而不添加成员,报错! (2013.12.05)

### 增加

1.User管理,增加删除确认警告(2013.11.21)
2.优化整体页面结构(2013.11.21)

## Director

### 修复

1.director 登录后 start vote 刷新浏览器 vote status 和 server status 不同步 一起的系列问题 (2013.11.12)
2,修复投票人数数据不同步 (2013.11.13)
3.修复一个重定向问题 .当用户登录后 再次 打开/login 自动重定向到主界面 (2013.11.14)
4.修复项目登录后,没有正常退出,无法正常登录 该项目锁死 (2013.11.14)
5.某些情况导致 项目开始投票显示人数不准确 (?)

### 增加

1.增加已经投票status 识别, 并且显示投票人数 (2013.11.13)
2.防止误操作功能, 如果已经完成了投票.再次打开投票 增加警告(2013.11.13)
3.重构登录机制,及时没有正常退出登录,现在也能 重新再次登录了. 后登录的人把之前的人挤下线 (2013.11.19)
4.初始投票项目,可能引起的报错问题(2013.11.20)

## User

### 修复

1.director 操作过快,导致推送间隔太短,或者user网络阻塞 . 导致 director 推送无效 ,director和 user 数据不同步 . (2013.11.07)


### 增加


## Global

1.更新 angular 1.0.6 到 angular 1.2.1 (版本变化较大) (2013.11.20)
2.更新 bootstrap 2.x 到 bootstrap 3.0 (针对html5优化,界面渲染性能提高) (2013.11.20)
3.布局优化,完善体验 (2013.11.20)

## MongoDB

1.database 冗余, management delete project 只删除了 project ID 没有删除 marks (2013.12.05)
2.director 重新打开已经投票的项目  database 无限 add  而不是 update , (2013.12.05)
3.-1,-2引发多条冗余记录 ,导致 director 搜寻 获取多条结果,未对结果进行过滤  (添加过滤方法 2013.12.04 );
  -1,-2,-3引发系列问题. 导致投票结果显示不准确 .

## Todo:

1.发现系统未完成功能 management->project list -> release
2.多数据视图分页







### 安装NodeJS和MongoDB
项目开发基于NodeJS和MongoDB开发，在进行下面的步骤前面，需要配置NodeJS和MongoDB具体参考它们的官方文档：

[MongoDB](http://www.mongodb.org/)

[NodeJS](http://nodejs.org/)

选择适应自己系统的版本进行下载和安装。NodeJS和MongoDB不是本项目需要讲述的文章，具体配置请参考官方文档。


### 下载源代码
从代码伺服器中获取稳定版或者开发版本的项目代码。伺服器使用的是Git Server在客户端需要下载Git Bash，推荐使用Google的[msysgit](http://code.google.com/p/msysgit/)。下载安装之后进入Bash，在指定的目录中Clone代码：

    git clone git@lbsvn01.hk.leoburnett.com:leewind/leo-project-gpc.git

如果需要Clone开发版本的代码，继续使用如下命令

    git pull git@lbsvn01.hk.leoburnett.com:leewind/leo-project-gpc.git dev:dev

这样会在本地创建一个新的Branch: Dev

### 安装module
下载完源代码之后，进入src目录，使用npm进行Module的安装。NPM在安装NodeJS时一起被安装，无需额外安装。

    npm install

会有一系列下载的提示

### 启动MongoDB
进入MongoDB的目录，在bin目录下启动DB Server，并且制定DB存储目录

    mongod.exe --dbpath c:/database/dev

### 启动NodeJS Server
进入下载源代码的目录，进入src目录，使用下面的命令启动Server

    node app