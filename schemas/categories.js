/**
* Created by ylfeng on 2018/4/9
* 定义数据库结构
*/

let mongoose = require('mongoose');

/**
 * 分类的表结构 
 * 一个schema代表一个表
 * 
 */ 
module.exports = new mongoose.Schema({
    // 分类名称
    name: String
});
