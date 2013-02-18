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