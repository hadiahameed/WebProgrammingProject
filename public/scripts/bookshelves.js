$(document).ready(function () {
    
    $(".btnEdit").click(function(){
        window.location.href = '/books/new'
    })

    $("#addShelf").click(function(){
        window.location.href = `/bookshelves/${username}/new`
    })

    $(".btnExc").click(async function () {
        try {
            let result = await axios.delete('/bookshelves', {
                data: {bookshelf: $(this).attr('id')}
              });
            location.reload(true)    
        }
        catch(e) {
            $.alert(`Oops! ${e.message}`)
        }
    })
    
    

})
