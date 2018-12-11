$(document).ready(function () {

    $(".reviewLike").click(async function () {
        $(this).attr('disabled', 'true');
        try {
            let response = await axios.patch('/review', {
                reviewId: $(this).attr('id')
            });
            if (response.data.msg) {
                $.alert(response.data.msg)
            }
            else {
                var likes = $(this).text();
                likes = parseInt(likes) + 1;
                $(this).text(" " + likes)
            }

        }
        catch (e) {
            $.alert(`Oops! ${e.message}`)
        }
    })
})