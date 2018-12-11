$(document).ready(function () {

    $(".btnEdit").click(async function () {
        //window.location.href = '/books/new'
        let q = new URLSearchParams()
        let bookshelf = $(this).parent().attr('id');
        q.append('bookshelf', bookshelf)
        window.location.href=`/books/new?${q.toString()}`
    })


    $("#addShelf").click(function () {
        window.location.href = `/bookshelves/${username}/new`
    })

    $(".btnExc").click(async function () {
        try {
            let response = await axios.delete('/bookshelves', {
                data: { bookshelf: $(this).parent().attr('id') }
            });
            if (response.data.msg) {
                $.alert(response.data.msg)
            }
            else {
                location.reload(true)
            }
        }
        catch (e) {
            $.alert(`Oops! ${e.message}`)
        }
    })

})
