$(".deleteBook").click(async function () {
    try {
        let response = await axios.delete('/books', {
            data: { book: $(this).attr('id') }
        });
        $.alert(response)
        location.reload(true)
    }
    catch (e) {
        $.alert(`Oops! ${e.message}`)
    }
})

$("#addBook").click(async function () {
    let bookId = $('.bookTitle').attr('id')
    try {
        let response = await axios.post(`/books/${bookId}`, {
            bookshelf: "Good"
        });
        if (response.data.msg){
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