'use strict';
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
    to: '295711882@qq.com', // list of receivers
    subject: 'Hello Lianghai', // Subject line
    // text: 'Thanks for your registration', // plain text body
    html: '<b>Hello Lianghai</b><br>Thanks for your registration. You are welcome to our club, literaryarchives.club' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
