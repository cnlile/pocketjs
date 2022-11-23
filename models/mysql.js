'use strict';

const Sequelize = require('sequelize');
const config = require('../config/datasource.json').mysql;
const log =  require('../lib/log4js')('sql');
const Op = Sequelize.Op;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'mysql',
  pool: {
    max: config.maxPool,
    min: config.minPool,
    idle: 10000
  },
  timezone: '+08:00',
  benchmark: true,
  /******* SQL 单独输出日志文件 *******/
  logging: function(sql, time, info) {
    log.trace('SQL:' + sql + ' || Execution time: ' + time + 'ms.');
    //log.info(info);
  },
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like,
    $in: Op.in,
    $ne: Op.ne,
    $between: Op.between,
    $notIn: Op.notIn
  }
});


module.exports = {
  db: sequelize
}