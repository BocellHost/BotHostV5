var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'udenrich@gmail.com',
    pass: 'wannofc35430'
  }
})

const verifemail = (tomail, htmlf, subjec) => {
  var options = {
    from: '"Wann Dev" <lordwann9>',
    to: tomail,
    subject: 'Sending Email using Nodejs',
    text: 'That was easy!'
  }
  transporter.sendMail(options, (err, info) => {
    if (err) throw err
    console.log('Berhasil Kirim Email Ke '+tomail+'info : \n'+info.response)
  })
}

module.exports = {
  verifemail
}
