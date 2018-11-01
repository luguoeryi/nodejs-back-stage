/**
* Created by ylfeng on 2018/4/9
* 用于对用户定义的表进行操作
*/

let mongoose = require('mongoose');

let categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category', categoriesSchema);