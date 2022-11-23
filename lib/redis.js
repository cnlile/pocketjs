/**************************************************************************
Summary: Redis 缓存处理
Description: 处理用户缓存数据的存取工作任务
**************************************************************************/
'use strict';

const Redis = require('ioredis');
const config = require( '../config/datasource').redis;

module.exports = function() {

  var client = new Redis({
    port: config.port,   // Redis port
    host: config.host,   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: config.password,
    db: config.db_number
  });

  return client;

};