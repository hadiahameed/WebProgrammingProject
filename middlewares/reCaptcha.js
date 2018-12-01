const axios = require('axios')
const url = require('url')

module.exports = (isAPI=false) => async (req, res, next) => {
    let g_response = req.body['g-recaptcha-response']
    if(!g_response) {
      res.render('pages/error', {
        message: "g-recaptcha-response is empty"
      })
      return
    }
    let params = new url.URLSearchParams()
    params.append('secret', '6Lf1GHsUAAAAAN_o1V9_wk8UEqc8dWSBLF0aEH23')
    params.append('response', g_response)
    let result = await axios.post('https://www.google.com/recaptcha/api/siteverify', params.toString(), {headers: {'content-type': 'application/x-www-form-urlencoded'} })
    if(!result.data.success) {
      if(isAPI) {
        return res.send({
          success: false,
          msg: 'Please recheck the CAPTCHA'
        })
      }
      res.render('pages/error', {
        message: "Invalid reCaptcha request"
      })
      return
    }
    next()
}