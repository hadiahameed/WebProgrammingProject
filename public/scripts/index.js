$(document).ready(function () {
    /*$('#newuser').on('submit', function() {
        let g_response = $('#g-recaptcha-response').val()
        if (!g_response) {
            $.alert('Please check the captcha box to proceed to the destination page.');
            return false
        }
    })*/
    $('#submitButton').click(function(e) {
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        let g_response = $('#g-recaptcha-response').val();
        if (password == confirmPassword){
            if (!g_response) {
                $.alert('Please check the captcha box to proceed to the destination page.');
                return false
            }
            else {
                return true;
            }
        }
        else {
            $.alert(`Passwords don't match.`);
            return false
        }
    })

})
    