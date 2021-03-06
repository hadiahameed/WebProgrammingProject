var quill = new Quill('#editor', {
    modules: {
        toolbar: { container: '#toolbar-container' }
    },
    theme: 'snow',
    placeholder: 'What\'s happening?'
});

async function loadFeeds() {
    let result = await axios.get('/api/timeline')
    let template = $('#media-object-template').html()
    if (!result.data.feeds) return
    for (let feed of result.data.feeds) {
        let tpl = $(template)
        tpl.find('.user-link').attr('href', `/timeline/${feed.username}`)
        tpl.attr('id', `feed-${feed.content_uuid}`).find('.username').eq(0).text(feed.username)
        $('.feeds-list').prepend(tpl)
        tpl.find('.time').eq(0).text(moment(feed.timestamp).fromNow())
        axios.get(`/api/user/${feed.username}/avatar`).then(res => {
            if (!res.data.img_url) return
            tpl.find('.media-avatar').eq(0).attr('src', `/${res.data.img_url}`)
        })
        let q = new Quill(`#feed-${feed.content_uuid} .content`, {
            readOnly: true
        })
        q.setContents(feed.content)
    }
}

$(document).ready(function () {
    loadFeeds()
    
    $('#postBtn').on('click', async function () {
        try {
            let content = quill.getContents()
            let result = await axios.post('/api/timeline', { content })
            if (result.data.success) {
                location.reload()
            }
            else {
                $.alert(result.data.msg)
            }
        }
        catch(e) {
            $.alert(e.message)
        }
    })

})