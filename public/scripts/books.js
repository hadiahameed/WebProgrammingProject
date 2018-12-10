$(".deleteBook").click(async function () {
    try {
        await axios.delete('/books', {
            data: { book: $(this).attr('id') }
        });
        location.reload(true)
    }
    catch (e) {
        $.alert(`Oops! ${e.message}`)
    }
})