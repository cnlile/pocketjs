/**************************************************************************
Copyright: 
Author: Lile
Date:2021-04-23
Description: 基础数据库操作模块
**************************************************************************/
'use strict';

const config = require('../config/datasource').mongodb;
const mongoose = require('mongoose');

const uri = "mongodb://" + config.username + ":" + config.password + "@" + config.host + ":" 
  + config.port + config.path;
const opt = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, opt, function( err ){
  if( !err ){
    console.log( 'DB == connect to mongodb' );
  } else {
    throw err;
  }
});

/**************************************************************************
Summary: 数据预处理
Description: 对参数做预处理，以防出现不合要求的参数，后面这块会做扩展
**************************************************************************/
function initData( data, db ){ 

  var query = {}; 

  for( let key in data ){
    if( db.tree[ key ] ){
        query[ key ] = data[ key ];
    }
  };
  return query;
};

function get_objectid(){
  //返回objectID
  var myid = new mongoose.Types.ObjectId;
  return myid.toString(); 
};

module.exports = {
  mongoose: mongoose,
  initData: initData,
  get_objectid: get_objectid
}
