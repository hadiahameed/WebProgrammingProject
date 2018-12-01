$(document).ready(function () {
    $('.logout').on('click', async function () {
        try {
            let result = await axios.delete('/api/session')
            location.href = '/'
        }
        catch(e) {
            $.alert(e.message)
        }
    })
})