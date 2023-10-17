const mailer = require('nodemailer')

const transport = mailer.createTransport({
    service : 'hotmail',
    auth : {
        user : 'edublogger.107@outlook.com',
        pass : 'edublog123',
    }
})

module.exports = transport