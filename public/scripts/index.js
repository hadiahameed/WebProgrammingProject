$(document).ready(function () {

    $('#submitButton').click(function(e) {
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();
        let g_response = $('#g-recaptcha-response').val();

        if (password != confirmPassword){
            $.alert(`Passwords don't match.`);
            return false
        }
        
        if (!g_response) {
            $.alert('Please check the captcha box to proceed to the destination page.');
            return false
        }

        return true;
    })

})
    