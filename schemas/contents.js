/**
* Created by ylfeng on 2018/4/12
* 定义数据库结构
*/

let mongoose = require('mongoose');

/**
 * 内容的结构 
 * 一个schema代表一个表
 * 
 */ 
module.exports = new mongoose.Schema({
    // 关联字段
    category: {
        // 类型
        type: mongoose.Schema.ObjectId,
        // 引用
        ref: 'Category'
    },

    // 内容标题
    title: String,

    // 内容描述
    description: {
        type: String,
        default: ''
    },

    // 内容正文
    content: {
        type: String,
        default: ''
    }
});
