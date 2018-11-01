/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();
let Category = require('../models/Category');
let Content = require('../models/Content');

let data = {};

router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});

/**
 * 首页
*/
router.get('/', function (req, res, next) {
    let page = req.query.page || 1
    let category = req.query.category || ''

    data.category = category;
    data.contents = [];
    data.count = 0;
    data.page = page;
    data.limit = 2;
    data.pages = 0;


    let where = {};

    if (category) {
        where.category = data.category;
    }
    
    // 读取所有的分类信息
    Content.where(where).count().then(function (count) {

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

/**
 * 内同页面
*/
router.get('/view', function (req, res, next) {
    let contentId = req.query.contentId || '';
    Content.findOne({
        _id: contentId
    }).populate(['user']).then(function (content) {
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view', {
            data: data
        });
    });
});

module.exports = router;
