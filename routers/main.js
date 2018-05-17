/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();
let Category = require('../models/Category');
let Content = require('../models/Content');

/**
 * 首页
*/
router.get('/', function (req, res, next) {
    let page = req.query.page || 1
    let data = {
        userInfo: req.userInfo,
        categories: [],
        contents: [],
        count: 0,
        page: page,
        limit: 2,
        pages: 0
    };
    
    // 读取所有的分类信息
    Category.find().then(function (categories) {

        data.categories = categories;

        return Content.count();

    }).then(function (count) {

        data.count = count;

        data.pages = Math.ceil(data.count / data.limit);

        data.page = Math.min(data.page, data.pages);

        data.page = Math.max(data.page, 1);

        let skip = (data.page - 1) * data.limit;

        return Content.find().limit(data.limit).skip(skip).populate(['category', 'user']);

    }).then(function (contents) {
        data.contents = contents;
        console.log(data);
        res.render('main/index2', {
            data: data
        });
    });
});

module.exports = router;
