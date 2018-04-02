/**
* Created by ylfeng on 2018/2/2
* 应用程序的启动（入口）文件
*/

// 加载express模块
let express = require('express');

// 创建模板引擎
let swig = require('swig');

// 加载数据库模块
let mongoose = require('mongoose');

// 加载body-parser, 用来处理post提交过来的数据
let bodyParser = require('body-parser');

// 创建app应用
let app = express();

/**
* 设置静态资源托管
* @param reqUrl 用户访问路径
* @param resUrl 返回的资源路径
*/
app.use('/public', express.static(__dirname + '/public'));

/**
* 配置应用模板, 定义当前应用所使用的模板引擎
* @param tplName 模板引擎名称，模板引擎后缀
* @param method 解析处理模板内容的方法
*/
app.engine('html', swig.renderFile);


/**
* 模板存放的目录
* @param views 必须是这个
* @param route 目录
*/
app.set('views', './views');

/**
* 注册使用的模板引擎
* @param view engine 必须是这个
* @param tplName 和app.engine定义的模板引擎名称一致
*/
app.set('view engine', 'html');

// 取消模板缓存 -- 开发过程中
swig.setDefaults({cache: false});

// bodyParser 设置
app.use(bodyParser.urlencoded({extended: true}));

/**
* 根据不同功能划分模块
*/
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 监听http听清
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log('数据路连接失败');
    } else {
        console.log('数据路连接成功');        
        app.listen(9091);
    }
});
