/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
    /**
    * 读取views 目录下的指定文件，解析并返回给客户端
    * @param telFile 模板的文件，相对于views目录
    * @param data 传递给模板使用的数据
    */
    res.render('main/index');
});

module.exports = router;
