$(document).ready(function () {
    $('#newuser').on('submit', function() {
        let g_response = $('#g-recaptcha-response').val()
        if (!g_response) {
            $.alert('Please check the captcha box to proceed to the destination page.');
            return false
        }
    })
})