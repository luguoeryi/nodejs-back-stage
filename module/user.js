/**
* Created by ylfeng on 2018/3/16
*/

let mongoose = require('mongoose');

var userSchemas = require('../schemas/users');

module.exports = mongoose.model('User', userSchemas);