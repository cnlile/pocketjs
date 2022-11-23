/**************************************************************************
Description: 签名与验签功能以及加密解密管理模块
**************************************************************************/
'use strict'

const crypto = require('crypto');
const bcrypt = require('bcrypt');
//const argon2 = require('argon2');
const salt = Buffer.alloc(16, 'heVOGy8Qu3YQeteQHHzWzuIb1aVBXxU1S');

/**************************************************************************
Summary: IV解密功能
Description: 8位数字的key, vi = 0的解密方式, pkcs5
**************************************************************************/
function decipheriv(ciph, algorithm, key, iv) {  
  var crypted = Buffer.from(ciph, 'base64').toString('binary');
  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
};

/**************************************************************************
Summary: 加密功能
Description: 8位数字的key, vi = 0的解密方式, pkcs5
**************************************************************************/
function cipheriv(plaintext, algorithm, key, iv) { 
  var decipher = crypto.createCipheriv(algorithm, key, iv);
  return decipher.update(plaintext, 'binary', 'base64') + decipher.final('base64');
};


//定义SHA1加密函数. 变为大写字符
function sha1(data) {
  if(data != null && typeof(data) == 'string' && data != ''){
    return crypto.createHash('sha1').update(data).digest('hex').toUpperCase();
  }else{
    return "";
  };
};

function dataHash(data){
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(data, salt);
};

function dataCompare(data, hash){
  try {
    return bcrypt.compareSync(data, hash);
  }catch(err){
    console.error('encrypt dataCompare err:', err.toString());
    return null;
  };
};

/**********RSA 加密 */
function rsaEncryption(str, publicKey){
  return crypto.publicEncrypt(publicKey, Buffer.from(str, 'utf-8')).toString('base64');
};

/**********RSA 解密 */
function rsaDecrypt(str, privateKey){
  return crypto.privateDecrypt(privateKey, Buffer.from(str, 'base64')).toString('utf-8');
};

/**************** argon2 的hash 算法 
async function aHashdata(str){
  return await argon2.hash(str, {type: argon2.argon2id, salt });
};

/****************argon2 的compare 
async function aDataCompare(hash, str){
  return await argon2.verify(hash, str);
};
******************/

function hmac(algorithm, key, str){
  return crypto.createHmac(algorithm, key).update(str, 'utf-8').digest('base64');
};

/***************** RSA 非对称签名生成算法 ********************/
function rsaSign(algorithm, privateKey, str){
  var sign = crypto.createSign(algorithm);
  sign.update(str);
  var sig = sign.sign(privateKey, 'base64');
  return sig;
};

/***************** RSA 非对称签名验证********************/
function rsaVerify(algorithm, publicKey, str, sign){
  var verify = crypto.createVerify(algorithm);
  verify.update(str);
  return verify.verify(publicKey, sign, 'base64');
};

/**************** 微信通知的AES-256-GCM 解密
 * key: 密钥
 * ciphertext: 加密数据
 * add: 附加数据
 * iv: 初始化GCM算法计数器的向量
*/
function aesGcmDecrypt(key, ciphertext, add, iv, algorithm){
  var cipherBuf = Buffer.from(ciphertext, 'base64');
  var authTag = cipherBuf.slice(cipherBuf.length - 16);
  var data = cipherBuf.slice(0, cipherBuf.length - 16);
  if (algorithm == null){
    algorithm = 'aes-256-gcm'
  };
  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(add));
  var decoded = decipher.update(data, null, 'utf8');
  decipher.final();
  return JSON.parse(decoded); //解密后的数据
};

/***************** api 非对称签名验证算法 ********************/
function apiVerify(algorithm, publicKey, sign, data){
  var verify = crypto.createVerify(algorithm);
  var str = JsonToKvstr(data);
  verify.update(str);
  return verify.verify(publicKey, sign, 'base64');
};

function JsonToKvstr(data){
  var arr = [];
  for(let key in data){
    if (typeof(data[key]) !== 'object' && key != 'sign'){
      arr.push(key + "=" + data[key]);
    };
  };
  return arr.sort().join("&");
};

module.exports = {
  hmac: hmac,
  cipheriv: cipheriv,
  decipheriv: decipheriv,
  /****** 
  aHashdata: aHashdata,
  aDataCompare: aDataCompare,
  **********/
  dataHash: dataHash,
  dataCompare: dataCompare,
  sha1: sha1,
  rsaEncryption: rsaEncryption,
  rsaDecrypt: rsaDecrypt,
  rsaSign: rsaSign,
  rsaVerify: rsaVerify,
  apiVerify: apiVerify,
  aesGcmDecrypt: aesGcmDecrypt
}