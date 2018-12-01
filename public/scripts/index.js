$(document).ready(function () {
    $('#login-form').validate({
        showErrors: function (errorMap, errorList) {
            if(errorList.length == 0) {
                return
            }
            let msg = ''
            for(err in errorMap) {
                msg += `<strong>${err}</strong>: ${errorMap[err]} `
            }
            $('#indexError').html(msg).fadeIn()
            setTimeout(() => $('#indexError').fadeOut(), 3000)
        }
    })
    
    $('#loginBtn').click(async function () {
        if($('#login-form').valid() == false) {
            return
        }
        let result = await axios.post('/session', {
            'user-name': $('input[name="user-name"]').val(),
            'user-password': $('input[name="user-password"]').val()
        })

        if(result.data.success) {
            location.href = ''
        }
    })
    
    $('#next-btn').click(function () {
        let result = $("#signUpModal form").validate().form()
        if(result == false) {
            return
        }
        $("#signUpModal").modal('hide')
        $("#infoModal").modal('show')
    });

    $('#getStarted').click(async function () {
        let valid = $('#infoModal form').validate().form()
        let captcha = $('.g-recaptcha textarea').val()

        if(valid == false) {
            return
        }

        if(captcha.length == 0) {
            $.alert('Are you a robot?')
            return
        }

        try {
            let result = await axios.post('/users', {
                'g-recaptcha-response': captcha,
                firstname: $('#first-name').val(),
                lastname: $('#last-name').val(),
                username: $('#user-name').val(),
                password: $('#user-password').val(),
                email: $('#email').val()
            })
    
            if(result.data.success != true) {
                $.alert(`Oops! ${result.data.msg}`)
            }
            $('.modal').modal('hide')
            $.alert('Great! Please validate your email and then log in!')
        }
        catch(e) {
            $.alert(`Oops! ${e.msg}`)
        }
    })

    $('#addShelf').click(function () {
        window.location.href = '/bookshelves/new';
    })

})
