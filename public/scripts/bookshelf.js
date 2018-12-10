$(document).ready(function () {

    $(".btnExc").click(async function () {
        try {
            let result = await axios.delete('/bookshelves', {
                data: {bookshelf: $(this).parent().attr('id')}
              });
            location.reload(true)    
        }
        catch(e) {
            $.alert(`Oops! ${e.message}`)
        }
    })
    
})
