/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Category = require('../models/Category');

router.use(function (req, res, next) {
    let userInfo = req.userInfo || {};
    if (!userInfo.isAdmin) {
        res.send('对不起，您不是管理员，无权限访问该页面');
        return;
    }
    next();
});

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

router.get('/user', function (req, res, next) {
    /**
     * 从数据库中读取所有用户数据
     * 
     * limit(Number) - 限制用户获取的条数
     * 
     * skip(Number) - 忽略数据的条数
    */

    let page = Number(req.query.page) || 1;
    let limit = 2;
    let pages = 0;

    User.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        
        let skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log({users});
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                limit: limit,
                pages: pages,
                page: page
            });
        });
    });
});

/**
 * 分类管理
*/
router.get('/category', function (req, res, next) {
    res.render('admin/category_index', {
        userInfo: req.userInfo
    });
});

/**
 * 分类添加
*/
router.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

/**
 * 分类的保存
*/
router.post('/category/add', function (req, res, next) {
    console.log(req.body);
    let name = req.body.name || '';
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空！'
        });
        return;
    }

    // 数据库中是否已经存在同名分类名称

    Category.findOne({
        name: name
    }).then(function (fs) {
        if (fs) {
            // 已经存在
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了！'
            });
            return Promise.reject();
        } else {
            // 不存在
            return new Category({ // promise
                name: name
            }).save();
        }
    }).then(function (newCategory) { // 接受一个promise对象，一条新记录
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功！',
            url: '/admin/category'
        });
    });
});



module.exports = router;
