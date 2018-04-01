
$(window).ready(function () {
    reg();
    login();

    $('#showLoginBtn').on('click', function () {
        var oFormLogin = $('.form-wrap-login')[0];
        var oFormReg = $('.form-wrap')[0];
        $(oFormLogin).show();
        $(oFormReg).hide();
    });
});

// 注册
function reg () {
    var aRegBtn = $('#btn-reg');
    var oFormReg = $('.form-wrap')[0];
    var oInfoStatus = $('.form-wrap .info-status')[0];
    var oFormLogin = $('.form-wrap-login')[0];
    $(aRegBtn).on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                userName: $(oFormReg).find('[name="username"]').val(),
                passWord: $(oFormReg).find('[name="password"]').val(),
                rePassword: $(oFormReg).find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (result) {
                if (result.status == 200) {
                    setTimeout(function () {
                        $(oFormReg).hide();
                        $(oFormLogin).show();
                    }, 1000);
                } else {
                    $(oInfoStatus).text(result.message);
                }
            }
        });
    });
}

// login
function login () {
    var aLoginBtn = $('#btn-login');
    var oFormLogin = $('.form-wrap-login')[0];
    var oInfoStatus = $('.form-wrap-login .info-status')[0];
    $(aLoginBtn).on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                userName: $(oFormLogin).find('[name="username"]').val(),
                passWord: $(oFormLogin).find('[name="password"]').val()
            },
            dataType: 'json',
            success: function (result) {
                if (result.status == 200) {
                    alert('登录成功');
                } else {
                    $(oInfoStatus).text(result.message);
                }
            }
        });
    }); 
}
