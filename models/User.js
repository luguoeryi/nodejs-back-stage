/**
* Created by ylfeng on 2018/3/16
* 用于对用户定义的表进行操作
*/

let mongoose = require('mongoose');

let userSchemas = require('../schemas/users');

module.exports = mongoose.model('User', userSchemas);