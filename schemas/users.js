/**
* Created by ylfeng on 2018/2/2
* 定义数据库结构
*/

let mongoose = require('mongoose');

/**
 * 用户的表结构 
 * 一个schema代表一个表
 * 
 */ 
module.exports = new mongoose.Schema({
    // 用户名
    username: String,
    // 密码
    password: String
});
