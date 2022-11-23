'use strict';

const db = require( './mongo');
const mySchema = db.mongoose.Schema;

//微信用户

const userSchema = new mySchema({
  user_id: {type: Number, index: true, unique: true},//ID
  phone_number: String,       //用户手机号码
  email: String,              //电子邮件
  cert_id: String,            //证件号码
  name: String,               //姓名
  address: String,            //联系地址
  class: String,              //班级
  update_timestamp: Number,   //更新时间戳 
  create_time: {type: Date, default:Date.now}
});

const userModel = db.mongoose.model( 'user', userSchema, 'user' );
module.exports = userModel;