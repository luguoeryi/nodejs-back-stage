
$(window).ready(function () {
    reg();
});

// 注册
function reg () {
    var aRegBtn = $('#btn-reg');
    var oFormReg = $('.form-wrap')[0];
    var oInfoStatus = $('.form-wrap')[0];
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
