$(document).ready(function() {
    var readURL = async function(input) {
        if (input.files && input.files[0]) {

            let formdata = new FormData()
            formdata.append('avatar', input.files[0])
            
            let res = await axios.patch('/user/profile', formdata);
            location.reload()
        }
    }
    

    $(".file-upload").on('change', function(){
        readURL(this);
    });
    
    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
});