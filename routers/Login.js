require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../controllers/DB')
const mailsender = require('../controllers/MailSender')
const axios = require('axios')
router.post('/' , (req, res)=>{

    console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/login")
    const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`


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
        
                        console.log(data)
                
                        if(err) return res.json({error : "Error on Server"})
                        if(data.length > 0){
                            bcrypt.compare(req.body.password.toString() , data[0].password , (err , result)=>{
                                if( err ) return res.json({error : "Error on Server"})
                                if(result){
                                    
                                    const name = data[0].user_id
                
                                    const token = jwt.sign({name} , process.env.JWT_SECRET_KEY , {expiresIn: '15s'})
                
                                    res.cookie('token', token)
                
                                    return res.json({status : "successful"})
                                }else{
                                    return res.json({error : "The email or password you've entered is invalid"})
                                }
                            })
                        }else{
                            return res.json({error : "Email doesn't exist"})
                        }   
                    })
                }else{
                    return res.json({error : "invalid verification code"})
                }
            })
        }else{
            return res.json({error : "reCAPTCHA verification failed"})
        }
    }).catch((error) => {
        // Handle the error
        res.status(500).json({ success: false, error: error.message });
      });




    
    
})


router.post('/verifying', (req, res)=>{
    console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/login/verifying")
    const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`


    db.query(sql , (err , data) =>{

        console.log(data)

        if(err) return res.json({error : "Error on Server"})
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString() , data[0].password , (err , result)=>{
                if( err ) return res.json({error : "Error on Server"})
                if(result){
                    return res.json({status : "successful"})
                }else{
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


module.exports = router