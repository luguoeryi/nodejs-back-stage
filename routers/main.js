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
    let category = req.query.category || ''
    let data = {
        userInfo: req.userInfo,
        categories: [],
        contents: [],
        category: category,
        count: 0,
        page: page,
        limit: 1,
        pages: 0
    };

    let where = {};

    if (category) {
        where.category = data.category;
    }
    
    // 读取所有的分类信息
    Category.find().then(function (categories) {

        data.categories = categories;

        return Content.where(where).count();

    }).then(function (count) {

        data.count = count;

        data.pages = Math.ceil(data.count / data.limit);

        data.page = Math.min(data.page, data.pages);

        data.page = Math.max(data.page, 1);

        let skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then(function (contents) {
        data.contents = contents;
        console.log(data);
        res.render('main/index2', {
            data: data
        });
    });
});

module.exports = router;
