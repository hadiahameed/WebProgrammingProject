$(document).ready(function () {
    $('.tag-check').not('#all').on('change', function () {
        let values = []
        $('.tag-check').not('#all').each(function (index, el) {
            if (el.checked) {
                values.push(el.value)
            }
        })
        let query_str = $('#check-form').data('query')
        let query = new URLSearchParams()
        query.append('q', query_str)
        query.append('tags', values.join('|'))
        window.location.href = `/search?${query.toString()}`
    })

    $('#all').on('change', function () {
        let query_str = $('#check-form').data('query')
        let query = new URLSearchParams()
        query.append('q', query_str)
        window.location.href = `/search?${query.toString()}`
    })
})