/**
* Created by ylfeng on 2018/2/2
*/
let express = require('express');
let router = express.Router();

router.get('/user', function (req, res, next) {
    res.send('<h1>api - user</h1>');
});

module.exports = router;
