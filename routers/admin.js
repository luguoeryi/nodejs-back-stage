/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();
let User = require('../models/User');
let Category = require('../models/Category');
let Content = require('../models/Content');

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

        User.find().sort({_id: -1}).limit(limit).skip(skip).then(function (users) {
            // console.log({users});
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                changePageUrl: '/admin/user'
            });
        });
    });
});

/**
 * 分类管理
*/
router.get('/category', function (req, res, next) {
    let page = Number(req.query.page) || 1;
    let limit = 2;
    let pages = 0;

    Category.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        
        let skip = (page - 1) * limit;

        /**
         * 1 升序
         * -1 降序
        */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                changePageUrl: '/admin/category'
            });
        });
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

/**
 * 分类的修改
*/
router.get('/category/edit', function (req, res, next) {
    let id = req.query.id || '';
    if (!id) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '修改提交有误！'
        });
        return;
    }

    // 获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在！'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    });
});

/**
 * 分类的保存
*/
router.post('/category/edit', function (req, res, next) {
    let id = req.query.id || '';
    let name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在！'
            });
            return Promise.reject();
        } else {
            if (name == category.name) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '您未修改分类名称！'
                });
                return Promise.reject();
            } else {
                // 要修改的名称是否在数据库中已经存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '该分类名称已经存在！'
            });
            return Promise.reject();
        } else {
            /**
             * @param {json} 条件
             * @param {json} 值
            */
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功！',
            url: '/admin/category'
        });
    });
});

/**
 * 分类的删除
*/
router.get('/category/delete', function (req, res, next) {
    let id = req.query.id;
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功！',
            url: '/admin/category'
        });
    });
});

/**
 * 内容管理
*/
router.get('/content', function (req, res, next) {
    let page = Number(req.query.page) || 1;
    let limit = 2;
    let pages = 0;

    Content.count().then(function (count) {
        // 计算总页数
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        
        let skip = (page - 1) * limit;

        /**
         * 1 升序
         * -1 降序
        */
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category', 'user']).then(function (contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                changePageUrl: '/admin/content'
            });
        });
    });
});

/**
 * 用户添加页
*/
router.get('/content/add', function (req, res, next) {
    Category.find().then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    });
});

/**
 * 内容添加
*/
router.post('/content/add', function (req, res, next) {
    let data = req.body
    let category = data.category;
    let title = data.title;
    let description = data.description;
    let content = data.content;

    if (!category) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '请选择所属分类！'
        });
        return;
    }
    if (!title) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '请填写文章标题！'
        });
        return;
    }
    if (!description) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '请填写文章描述！'
        });
        return;
    }
    if (!content) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '请填写文章内容！'
        });
        return;
    }

    // 保存
    new Content({
        user: req.userInfo._id.toString(),
        category: category,
        title: title,
        description: description,
        content: content
    }).save().then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '文章内容保存成功！'
        });
    });
});

/**
 * 内容添加
*/
router.get('/content/edit', function (req, res, next) {
    let id = req.query.id || '';
    let categories = [];
    Category.find().then(function (rs) {
        categories = rs;
        return Content.findOne({_id: id});
    }).then(function (content) {
        res.render('admin/content_edit', {
            userInfo: req.userInfo,
            content: content,
            categories: categories
        });
    });
});

/**
 * 内容编辑
*/
router.post('/content/edit', function (req, res, next) {
    let id = req.query.id || '';
    let category = req.body.category || '';
    let title = req.body.title || '';
    let description = req.body.description || '';
    let content = req.body.content || '';

    if (!title) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空！'
        });
        return;
    }
    Content.find({
        _id: id
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '内容不存在！'
            });
            return Promise.reject();
        }
        return Content.update({
            _id: id
        }, {
            category: category,
            title: title,
            description: description,
            content: content
        });
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功！',
            url: '/admin/content'
        });
    });
});

/**
 * 内容删除
*/
router.get('/content/delete', function (req, res, next) {
    let id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功！',
            url: '/admin/content'
        });
    });
});


module.exports = router;
