async function loadTimeline(username) {
    let res = await axios.get(`/api/timeline/${username}`)
    let template = $('#media-object-template').html()
    for (let index in res.data.timeline) {
        let timeline = res.data.timeline[index]
        let tpl = $(template)
        tpl.attr('id', `timeline-${index}`).find('.username').eq(0).text(username)
        $('.feeds-list').prepend(tpl)
        tpl.find('.time').eq(0).text(moment(timeline.timestamp).fromNow())
        axios.get(`/api/user/${username}/avatar`).then(res => {
            if (!res.data.img_url) return
            tpl.find('.media-avatar').eq(0).attr('src', `/${res.data.img_url}`)
        })
        let q = new Quill(`#timeline-${index} .content`, {
            readOnly: true
        })
        q.setContents(timeline.content)
    }
}

$(document).ready(function () {
    loadTimeline(username)

    $('#viewProfile').on('click', async function() {
        window.location.href = `/user/${username}`
    }),

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
