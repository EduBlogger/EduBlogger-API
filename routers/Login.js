require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../controllers/DB')
const mailsender = require('../controllers/MailSender')

router.post('/' , (req, res)=>{

    console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/login")
    const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`

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
        
                            const token = jwt.sign({name} , process.env.JWT_SECRET_KEY , {expiresIn: '1d'})
        
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