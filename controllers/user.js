'use strict'
const common = require('../lib/common');
//const userModel = require('../model/user);

async function query(req, res) { 

  try{

    var body = req.query;

    common.resMsg({
      id: body.id
    }, res); 


  }catch(error){
    common.resMsg({error: error, operation:'query'}, res); 
  }  
};


module.exports = {
  query: query,
}