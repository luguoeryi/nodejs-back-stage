/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();
let User = require('../models/User');

router.get('/user', function (req, res, next) {
    res.send('<h1>api - user</h1>');
});

// 统一返回格式
let resData;
router.use(function (req, res, next) {
    resData = {
        status: 200,
        message: '',
        response: {}
    }
    next();
});

/**
 * 用户注册
 * 注册逻辑
 *  -- 前台逻辑
 * 1.用户名不能为空
 * 2.密码不能为空
 * 3.两次密码一致
 *  -- 后台逻辑
 * 1.用户是否已经注册
 * 2.数据库查询
*/

router.post('/user/register', function (req, res, next) {
    // res.send('register');
    // console.log(req.body);
    let body = req.body;
    let userName = body.userName;
    let passWord = body.passWord;
    let rePassword = body.rePassword;

    // 用户名是否为空
    if (userName == '') {
        resData.status = 201;
        resData.message = '用户名不能为空！';
        return res.json(resData);
    }

    // 密码是否为空
    if (passWord == '') {
        resData.status = 201;
        resData.message = '密码不能为空！';
        return res.json(resData);
    }

    // 密码不一致
    if (passWord != rePassword) {
        resData.status = 201;
        resData.message = '两次输入的密码不一致！';
        return res.json(resData);
    }

    // 用户名是否已经被注册，如果数据库中已经存在和我们要注册的用户名有同名的数据，表示该用户名已经被注册了
    User.findOne({
        userName
    }).then(userInfo => {
        if (userInfo) { // 表示数据库中有该记录
            resData.status = 202;
            resData.message = '用户名已经被注册了！';
            return res.json(resData);
        }
        // 保存用户名注册的信息到数据库中
        let user = new User({
            userName,
            passWord
        });
        return user.save();
    }).then(newUserInfo => {
        console.log(newUserInfo);
        resData.status = 200;
        resData.message = '注册成功！';
        res.json(resData);
    });

});

router.post('/user/login', function (req, res, next) {
    // res.send('login');
    // console.log(req.body);
    let body = req.body;
    let userName = body.userName;
    let passWord = body.passWord;

    // 用户名是否为空
    if (userName == '') {
        resData.status = 201;
        resData.message = '用户名不能为空！';
        return res.json(resData);
    }

    // 密码是否为空
    if (passWord == '') {
        resData.status = 201;
        resData.message = '密码不能为空！';
        return res.json(resData);
    }

    // 用户名和密码进行查询，如果存在说明用户名密码正确，登录成功
    User.findOne({
        userName,
        passWord
    }).then(userInfo => {
        if (userInfo) { // 表示数据库中有该记录
            resData.status = 200;
            resData.message = '登录成功！';
            resData.response.userInfo = {
                _id: userInfo._id,
                userName: userInfo.userName
            }
            return res.json(resData);
        } else {
            resData.status = 201;
            resData.message = '用户名或密码错误';
            return res.json(resData);
        }
    })
});

module.exports = router;
