const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../controllers/DB')
const cookie = require('cookie-parser')
const mailsender = require('../controllers/MailSender')

const router = express.Router()

router.use(cookie())

router.post('/',  async (req, res)=>{



    console.log(req.body)

    const data = {
        email : req.body.email,
        code : req.body.code,
        hashcode : req.body.vrcxx,
        password : await bcrypt.hash(req.body.password , 10)
    }


    if(data.hashcode === undefined) {
        return res.json({status : 'unauthorized'})
    }


    console.log(data)
    
    const newpass = `UPDATE user SET password = '${data.password}' , verification = NULL WHERE email='${data.email}'`


    bcrypt.compare(data.code , data.hashcode , (err , hash)=>{
        if(err){
            console.log(err)
            return res.json({message : "error"})
        } 

        if(hash){
            db.query(newpass, (err , data)=>{
                console.log(data)
                if(err){
                    console.log(err)
                    return res.json({message : 'error'})
                } 
                res.clearCookie('rpvcxx')
                return res.json({status : 'ok'})
            })

        }else{
            return res.json({message : "invalid verifictaion code"})
        }
    })

})


router.post('/check_email', (req, res)=>{

    const sql = `SELECT email , first_name FROM user WHERE email = '${req.body.email}'`

    db.query(sql, (err, data)=>{
        if(err) return res.json({err : "Error on Server"})

        console.log(data)

        if(data.length === 0) return res.json({message : "could not find email account"})

        return res.json({message : "ok"})

    })
    
})

router.post('/verify_code', (req, res)=>{



    const data = {
        code : req.body.code_v,
        hashcode : req.body.code
    }

    if(data.hashcode === undefined) {
        return res.json({status : 'unauthorized'})
    }

    console.log(data)

    bcrypt.compare(data.code , data.hashcode , (err, ress)=>{
        if(err) {
            console.log(err)
            return res.json({err : "Error on Server"})
        }
        if(ress){
            console.log(ress)
            return res.json({status : "ok"})
        }else{
            return res.json({status : "invalid verification code"})
        }
    })
})


router.post('/send_code_email_verify', mailsender, (req, res)=>{
    console.log('hello')
    res.json(req.vrcxxData)
})



module.exports = router


