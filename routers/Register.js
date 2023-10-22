const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../controllers/DB')
const mailsender = require('../controllers/MailSender')
const router = express.Router()

router.post('/', async (req, res)=>{


    await bcrypt.hash(req.body.password, 10).then(
        hash => {
            const values = {
                fname : req.body.fname.trim(), 
                mname : req.body.mname.trim(), 
                lname : req.body.lname.trim(),
                email : req.body.email.trim().toLowerCase(),
                password : hash
            }
            
            const sql = `INSERT INTO user (first_name , middle_name , last_name ,  password , email ) VALUES('${values.fname}', '${values.mname}' ,'${values.lname}', '${values.password}', '${values.email}')`
            
            db.query(sql, (err, data)=>{
                console.log(data)
                console.log("regster a user " + values.fname)
                if(!err) return res.json({status : 'ok',message : "register successfully."})
                return res.json({message : "register unsuccessfull."})
            })
        }
    )
    
})

router.post('/check_email', (req, res)=>{

    const sql = `SELECT email FROM user WHERE email = '${req.body.email}'`

    db.query(sql, (err, data)=>{
        if(err) return res.json({err : "Error on Server"})

        if(data.length === 0) return res.json({message : "ok"})

        return res.json({message : "this email is already in used."})
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

    bcrypt.compare(data.code , data.hashcode , (err, ress)=>{
        if(err) {
            console.log(err)
            return res.json({err : "error"})
        }else{
            if(ress){
                return res.json({status : "ok"})
            }else{
                return res.json({status : "invalid verification code"})
            }
        }
    })

})

router.post('/send_code_email_verify', mailsender, (req, res)=>{
    const data = req.vrcxxData
    res.json(data)
})


module.exports = router

