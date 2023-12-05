require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../controllers/DB')
const mailsender = require('../controllers/MailSender')
const mail = require('../controllers/mail')
const generateOTP = require('../controllers/OTP')
const cookie = require('cookie-parser')
const axios = require('axios')
const login_log = require('../controllers/RecordLogin')

router.post('/' , (req, res)=>{

    console.log("[HTTP REQUIEST]: users is requiesting in Server :/api/login")
    const sql = `SELECT * FROM users WHERE email = '${req.body.email}'`


    console.log(req.body.recaptcha)

    console.log('-----------------------------------------------------')


    /* this will send a request to the google recaptcha api */

    const token = req.body.recaptcha
    const secretKey = process.env.RECAPTCHA_KEY

    axios.post('https://www.google.com/recaptcha/api/siteverify', null , {
        params: {
            secret: secretKey,
            response: token
    }}).then((e)=>{
        if(e.data.success){
            bcrypt.compare(req.body.verify_code, req.body.vsxx , (err , result)=>{
                if( err ) return res.json({error : "Error on Server"})
                if(result){
                    db.query(sql , (err , data) =>{
    
                
                        if(err) return res.json({error : "Error on Server"})
                        if(data.rows.length > 0){
                            bcrypt.compare(req.body.password.toString() , data.rows[0].password , (err , result)=>{
                                if( err ) return res.json({error : "Error on Server"})
                                if(result){
                                    
                                    const user = {
                                        username : data.rows[0].first_name,
                                        user_id : data.rows[0].user_id
                                    }

                                    console.log("userdata : " + user.toString())
                                    console.log("user " + user.username + " is login [Time]: " + (new Date()).getDate())
                
                                    const token = jwt.sign( {userdata : user} , process.env.JWT_SECRET_KEY , {expiresIn: '30d'})
                
                                    res.cookie('token', token)
                                    login_log(user.user_id , 'SUCCESSFULL')
                                    return res.json({status : "successful"})
                                }else{
                                    login_log(user.user_id , 'FAILED')
                                    return res.json({error : "The email or password you've entered is invalid"})
                                }
                            })
                        }else{
                            return res.json({error : "Email doesn't exist"})
                        }   
                    })
                }else{
                    login_log(user.user_id , 'FAILED')
                    return res.json({error : "invalid verification code"})
                }
            })
        }else{
            login_log(user.user_id , 'FAILED')
            return res.json({error : "reCAPTCHA verification failed"})
        }
    }).catch((error) => {
        // Handle the error
        res.status(500).json({ success: false, error: error.message });
      });




    
    
})


router.post('/verifying', (req, res)=>{
    console.log("[HTTP REQUIEST]: users is requiesting in Server :/api/login/verifying")
    const sql = `SELECT * FROM users WHERE email = '${req.body.email}'`


    db.query(sql , (err , data) =>{
        if(err) return res.json({error : "Error on Server"})
        if(data.rows.length > 0){
            bcrypt.compare(req.body.password.toString() , data.rows[0].password , (err , result)=>{
                if( err ) return res.json({error : "Error on Server"})
                if(result){
                    return res.json({status : "successful"})
                }else{
                    login_log(data.rows[0].user_id , 'FAILED')
                    return res.json({error : "The email or password you've entered is invalid"})
                }
            })
        }else{
            return res.json({error : "Email doesn't exist"})
        }   
    })
})


router.post('/send_code', mailsender, (req, res)=>{
    const data = req.vrcxxData
    return res.json(data)
})


router.post('/admin/otp', (req, res)=>{
    const key = generateOTP()

    bcrypt.hash(key , 10 , (error , hash)=>{

        if(error) {
            console.log(error)
            return res.send({successfull : false})
        }
        
        if(hash){
            console.log('key : ' + key)
            console.log("hash result : " + hash)

            const htmlContent = `
                <p>OTP KEY : <b>${key}</b></p>
                `
                
                const mailOptions = {
                    from: "edublogger.107@outlook.com",
                    to: process.env.ADMIN_EMAIL,
                    subject: "EduBlogger Admin OTP",
                    html: htmlContent,
                };
                res.cookie('hash_token' , hash)
                mail.sendMail(mailOptions , (err , info)=>{
                    if(!err){
                        console.log(info.response)
                        console.log('hash token: ' + req.cookies.hash_token)
                    return res.send({successfull : true})
                }else{
                    console.log(err)
                    return res.send({successfull : false})
                } 
            })

        }else{
            return res.send({successfull : false})
        }
    })
})


router.post('/admin' , (req, res)=>{
    const key = req.body.key
    
    const hash_key = req.cookies.hash_token
    
    console.log(key)
    console.log(hash_key)
    
    bcrypt.compare(key , hash_key , (error , auth)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(auth){

            const admin_session_key = process.env.ADMIN_SESSION_KEY
            
            const admin_token = jwt.sign( { key : admin_session_key} , process.env.JWT_SECRET_KEY , {expiresIn: '1h'} )

            res.cookie('adminToken', admin_token)

            return res.send({successfull : true , admin_token : admin_token})

        }else{
            console.log(auth)
            return res.send({successfull : false})
        }
        
    })

})





module.exports = router