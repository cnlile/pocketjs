/*********************短信信息数据 */
'use strict';

const { DataTypes } = require("sequelize");
const mysql = require('./mysql');

module.exports = mysql.db.define('sms', {
  sms_id: { type: DataTypes.STRING(42), allowNull: false, unique: true}, //服务ID
  platform_id: { type: DataTypes.STRING(6), allowNull: false}, //服务ID
  phone_number: {type: DataTypes.STRING(20)}, //联系电话, 
  platform_user_id: {type: DataTypes.STRING(32)}, //平台的用户ID',
  action: {type: DataTypes.STRING(12)}, //请求方式',
  hash_code: {type: DataTypes.STRING(128)}, //验证代码, 加密后存储
  verify_timestamp: { type: DataTypes.INTEGER },//验证时间戳,
  expire_timestamp: { type: DataTypes.INTEGER },//验证时间戳,
  msg: {type: DataTypes.STRING(128)}, // '请求信息',
  status: {type: DataTypes.INTEGER }, //状态
  servicer_type: {type: DataTypes.STRING(12)}, //服务商类型
  update_time: {type: DataTypes.DATE }, //更新时间
  create_time: {type: DataTypes.DATE }  //新建时间
}, {
  freezeTableName: true,  // Model tableName will be the same as the model name
  timestamps: false,       // 是否需要增加createdAt、updatedAt、deletedAt字段
  deletedAt: false
});