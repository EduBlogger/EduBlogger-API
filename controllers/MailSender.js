const bcrypt = require('bcrypt')
const codegen = require('./CodeGen')
const mail = require('./mail')


const mailsender = async (req, res , next) =>{
    const code = codegen()

    const vrcxx = await bcrypt.hash(code ,10)

    console.log('verificattion code : ' + code)


    const htmlContent = `<!DOCTYPE html>
        <html lang="en">
            <head>
                <style>
                    *{
                        font-family: 'Basic', sans-serif;
                        font-family: 'Quicksand', sans-serif;
                    }
                    
                    .contnaier{
                        width: 50%;
                        margin: 0 auto;
                    }
            
                    .logo{
                        padding: 1rem 0;
                    }
            
                    .head-line{
                        font-size: 60px;
                        font-weight: 700;
                        padding-bottom: 1rem;
                    }
            
                    .ver{
                        width: 20%;
                        background-color: #F25019;
                        font-size: 30px;
                        color: white;
                        padding: 40px;
                        margin: 5rem auto;
                        border-radius: 20px;
                        font-weight: 900;
                        text-align: center;
                    }
            
                    .contact{
                        margin: 2rem 0;
                    }
            
                </style>
            </head>
            <body>
                <div class="contnaier">
                    <h1 class="head-line">Verify your Email Account</h1>
                    <p>Hello, Thank you for choosing Edublogger! To ensure the security of your account, here is your verification code.
                    <br>
                    Please use the following verification code to complete the process:
                    <br>
                    Verification Code: ${code}
                    <br>
                    If you did not request this code, please disregard this email. Your account security is important to us.
                    <br>
                    Best regards, <br>The Edublogger Team
                    </p>
                    <h3 class="ver">${code}</h3>
                    <br>
                    <hr>
                    <div class="contact">
                        <p>Contact</p>
                        <p><b>Outlook </b>: edublogger.107@outlook.com</p>
                        <p><b>Gmail</b> : edublogger.107.@gmail.com</p>
                        <p>© 2023 EduBlogger</p>
                    </div>
                </div>
            </body>
        </html>`
        const mailOptions = {
            from: "edublogger.107@outlook.com",
            to: req.body.email,
            subject: "EduBlogger Verification Account",
            html: htmlContent,
        };


        mail.sendMail(mailOptions , (err , info)=>{
            if(!err){
                console.log(info.response)
                console.log(req.cookies)
                console.log(req.vrcxxData)
                req.vrcxxData = {status : "ok", message : "email send successfull....." , code : vrcxx}
                return next()
            }else{
                console.log(err)
                req.vrcxxData = {message : "Error while sending email"}
                return next()
            } 
        })

}

module.exports = mailsender