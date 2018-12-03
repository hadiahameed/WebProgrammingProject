
$(document).ready(function () {
    $('#followBtn').on('click', async function () {
        let username = $(this).data('username')
        try {
            let result = await axios.post(`/api/user/${username}/follower`)
            if (result.data.success == false) {
                $.alert(result.data.msg)
                return
            }
            location.reload()
            // $(this).addClass('d-none')
            // $('#unfollowBtn').removeClass('d-none')
        }
        catch(e) {
            $.alert(e.message)
        }
    })

    $('#unfollowBtn').on('click', async function () {
        let username = $(this).data('username')
        try {
            let result = await axios.delete(`/api/user/${username}/follower`)
            if (result.data.success == false) {
                $.alert(result.data.msg)
                return
            }
            location.reload()
            // $(this).addClass('d-none')
            // $('#followBtn').removeClass('d-none')
        }
        catch(e) {
            $.alert(e.message)
        }
    })
})
