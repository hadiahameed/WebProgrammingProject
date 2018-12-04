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


// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    $('.lds-ellipsis').fadeIn()
    return config;
}, function (error) {
    // Do something with request error
    $('.lds-ellipsis').fadeOut()
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    $('.lds-ellipsis').fadeOut()
    return response;
}, function (error) {
    // Do something with response error
    $('.lds-ellipsis').fadeOut()
    return Promise.reject(error);
});