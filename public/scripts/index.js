

$(document).ready(function () {
    /*$('#newuser').on('submit', function() {
        let g_response = $('#g-recaptcha-response').val()
        if (!g_response) {
            $.alert('Please check the captcha box to proceed to the destination page.');
            return false
        }
    })*/
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
