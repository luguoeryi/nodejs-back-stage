/**
* Created by ylfeng on 2018/4/12
* 用于对用户定义的表进行操作
*/

let mongoose = require('mongoose');

let contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content', contentsSchema);