/**************************************************************************
Description: 系统公共使用组件管理模块
**************************************************************************/
'use strict'
const moment = require('moment');
const axios = require('axios');
const crypto = require('crypto');
const uuid = require('uuid');
const log = require('./log4js')();
//const redis = require('./redis')();
const encrypt = require('./encrypt');
const retmsg = require('../config/retmsg');

/*************请求返回函数 */
function resMsg(data, res) {

  var ReqUuid = res.getHeader('Req-Uuid');

  if (data.error != null){

    let retErrorMsg = Object.assign({}, retmsg.EXCEPTIONS, {error: data.error});//错误数据
    res.send(retErrorMsg);
    log.error('server.api error: ' + JSON.stringify(retErrorMsg) + ', --' + ReqUuid);
    saveErrData(Object.assign({
      ReqUuid: ReqUuid, 
      reqNumber: res.getHeader('Req-Number')
    }, data));//记录错误数据

  }else if(data.code != null && data.message != null && data.code != retmsg.SUCCESS.code){

    data.timestamp = moment().format('X');
    if (data.code != 0){
      log.error('server.api error: ' + JSON.stringify(data) + ', --' + ReqUuid);
    }else{
      log.info('server.api success return: ' + JSON.stringify(data) + ', --' + ReqUuid);
    };
    res.send(Object.assign({}, data));

  }else{

    data.timestamp = moment().format('X');
    let doc = Object.assign({}, retmsg.SUCCESS, data);
    if (doc.list != null && Array.isArray(doc.list)){
      //简化list 日志显示
      doc.listDataLength = doc.list.length;
      delete doc.list;
      //list 去除null
      for(let i = 0; i < data.list.length; i++){
        if ( typeof(data.list[i]) == 'object'){
          for(let key in data.list[i]){
            if (data.list[i][key] == null || data.list[i][key] == 'null'){
              delete data.list[i][key];
            };
          };
        };
      };
    };
    
    log.info('server.api success return: ' + JSON.stringify(doc) + ', --' + ReqUuid);
    res.send(Object.assign({}, retmsg.SUCCESS, data));

  };
 
};

/****************** 下划线转驼峰 ********************/
function replaceUnderLine (val, char = '_') {
  var arr = val.split('');
  var index = arr.indexOf(char);
  while ( index != -1 ){
    arr.splice(index, 2, arr[index + 1].toUpperCase());
    index = arr.indexOf(char);
  };
  return arr.join('');
};

function md5(content) {
  return crypto.createHash('md5').update(content).digest('base64');
};

function hmac(algorithm, key, txt) {
  return crypto.createHmac(algorithm, key).update(txt).digest("base64");
};

/**************************************************************************
Summary: 产生随机数 Math.floor(Math.random()*10)
Description: 根据参数，产生不通位数的随机数字组合字符串
**************************************************************************/
function getRandstr(loop){
  var result = "";
  for(let i = 0; i < loop; i++){
    result += Math.floor(Math.random()*10); 
  };
  return result;
};

/***********http api 请求 */
async function apiReq(data){

  try{

    var config = {
      url: data.url,
      method: data.method,
      headers: {'content-type': 'application/json;charset=utf-8'},
      responseType: 'json',
      responseEncoding: 'utf-8',
    };
    
    if (data.headers != null){
      config.headers = Object.assign(config.headers, data.headers);
    };

    if (data.method !== 'get'){
      config.data = data.data;  
    }else{
      config.params = data.data;
    };
  
    if (data.proxy != null){
      config.proxy = data.proxy;
    };
    
    if (data['Content-Type'] != null){
      config.headers['Content-Type'] = data['Content-Type'];
    };

    log.info('common.apiReq req:' + JSON.stringify(config) + ', --' + data['Req-Uuid'] );
    var result = await axios.request(config);

    if (result.status == 200){
      let doc = Object.assign({}, result.data);
      if (Array.isArray(doc.list)){
        doc.listDataLength = doc.list.length;
        delete doc.list;
      };
      log.info('common.apiReq res:' + JSON.stringify(doc) + ', --' + data['Req-Uuid'] );
      return result.data;
    }else{
      log.warn('common.apiReq res:' + result.toString() + ', --' + data['Req-Uuid'] );
      return {error: result};
    };

  }catch(error){
    if (error != null && error.response != null && error.response.data != null ){
      log.error('common.apiReq res:' + JSON.stringify(error.response.data) + ', --' + data['Req-Uuid'] );
      return {error: error.response.data};
    }else{
      log.error('common.apiReq res:' + error.toString() + ', --' + data['Req-Uuid'] );
      return {error: error};
    };
  };

};

async function apiReqData(data, config){

  data.timestamp = moment().format('X');
  let sign = encrypt.apiSign(config.algorithm, config.privateKey, data);
  data.sign = sign;

  return await apiReq({
    method: config.method,
    url: config.url,
    data: data,
    "Req-Uuid": config['Req-Uuid']
  });

};

/***********记录错误数据 */
function saveErrData(data){
  var error = null;
  if (typeof(data.error) != 'string'){
    if (typeof(data.error) == 'object'){
      error = JSON.stringify(data.error);
    }else if (data.error != null){
      error = data.error.toString();
    };
  }else{
    error = data.error;
  };
};

//定义SHA1加密函数. 变为大写字符
function sha256(data) {
  if(data != null && typeof(data) == 'string' && data != ''){
    return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
  }else{
    return "";
  };
};

module.exports = {
  getRandstr: getRandstr,
  apiReq: apiReq,
  apiReqData: apiReqData,
  resMsg: resMsg,
  md5: md5,
  sha256: sha256,
  hmac: hmac,
  saveErrData: saveErrData
};