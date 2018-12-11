$(document).ready(function () {

    $(".reviewLike").click(async function () {
        $(this).attr('disabled','true');
        try {
            await axios.patch('/review', {
                reviewId: $(this).attr('id')
            });
            var likes = $(this).text();
            likes = parseInt(likes) + 1;
            $(this).text(" "+likes)
        }
        catch (e) {
            $.alert(`Oops! ${e.message}`)
        }
    })
})