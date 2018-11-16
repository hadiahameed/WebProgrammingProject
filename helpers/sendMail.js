module.exports = function ({
    to,
    subject,
    html,
}) {
    const nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'AKIAJEKIUQ5K5BRPBW7A', // generated ethereal user
            pass: 'AhJpNyXKZb4kcYq5siZihhJSWvCRi4XrVrj7FWRXS78O' // generated ethereal password
        }
    });
    
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"no-reply" <no-reply@literaryarchives.club>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        // text: 'Thanks for your registration', // plain text body
        html: html // html body
    };
    
    return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({ success: false, error: error });
            }
            resolve({ success: true })
        });
    })
}
