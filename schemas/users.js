/**
* Created by ylfeng on 2018/2/2
*/

let mongoose = require('mongoose');

// 用户的表结构
module.exports = new mongoose.Schema({
    // 用户名
    username: String,
    // 密码
    password: String
});
