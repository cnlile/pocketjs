'use strict';
const log4js = require('log4js');
const config = {
  appenders: { 
    log: { 
      "type": "dateFile",
      "filename":"./logs/log",
      //目录
      "pattern": "yyyyMMdd.log",
      "absolute":true,
      "alwaysIncludePattern":true
    },
    sql: {
      "type": "dateFile",
      "filename": "./logs/sql",
      "pattern": "yyyyMMdd.log",
      "alwaysIncludePattern":true
    }
  },
  categories: { 
    default: { appenders: ['log'], level: 'all' },
    sql: { appenders: ['sql'], level: 'all' },
  }
};
log4js.configure(config);

module.exports = function (type) {
  const logs = log4js.getLogger(type);
  return logs;
};