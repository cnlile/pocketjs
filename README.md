# pocketjs
mini combination api service base in express

##About pocketjs
这个一个基于Nodejs Express 框架之上的组合api服务，加载常用的组件，并且进行了整合，追求简单，快速，方便，下载即用。也可以作为一个express 实用的应用案例，以供大家学习传统的express服务的使用。

## Get started
  快速开始的方式，打开一个demo api服务方式进行体验。
### Setp 1
git clone --depth 1 https://github.com/cnlile/pocketjs.git
### Step 2
cd pocketjs
npm install 
### Step 3
node app.js
### Step 4
curl http://localhost:8008/v1/user?id=11

## Usage

###  Modify Config File
  基于配置的方式定义api应用, 主要基于./config 目录下文件。每次修改完配置文件后，请重启服务。
`1.` api file
    默认的api配置文件为apiservice.json，采用标准的openapi定义文件，即可生成api应用，业务内容指向./controllers 下文件内容。
`2.` service file
    修改 服务配置文件为 serve.json，可以修改服务参数，例如port，path。
`3.` database file
    修改 数据库文件 datasource.json，配置数据库链接，默认在./models 下定义了mongodb （mongoose） 和 mysql （sequelize） 数据库文件。在models目录下，定义数据库表结构映射文件。
`4.` controllers file
    基于api请求的内容的修改访问控制 controllers.json 文件，修改参数，设置自定义访问控制内容。operation下控制每个请求的具体controller控制函数，其为api控制文件的operationId作为对应每个访问请求，authCaller参数设置访问者限制，在http请求头部"access-caller"内容中。该值可以设置为all，为全体用户。
`5.` res return message file
    定义了一部分http 请求返回数据的格式，可以自行添加。

### 结合PM2 使用
    npm install pm2 -g
    pm2 start nodejs --name xxxx 

### 使用Swagger Doc
    修改 server.json 文件，设置  "swagger-docs": true， 打开浏览器，访问http://localhost:8008/docs

### 其它
    ./boot 下为服务器执行启动时，执行的脚本。
    ./routers/middleware.js 下为控制请求前，需要执行的函数处理。范例内，有一个RSA的签名请求拦截处理，已经被注释了，可以做参考。

