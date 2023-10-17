require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../controllers/DB')

router.post('/' , (req, res)=>{

    console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/login")
    const sql = `SELECT * FROM users WHERE email = '${req.body.email}'`


    db.query(sql , (err , data) =>{

        console.log(data)

        if(err) return res.json({message : "Error on Server"})
        if(data.length > 0){
            bcrypt.compare(req.body.password.toString() , data[0].password , (err , result)=>{
                if( err ) return res.json({message : "Error on Server"})
                if(result){

                    const name = data[0].username

                    const token = jwt.sign({name} , process.env.JWT_SECRET_KEY , {expiresIn: '1d'})

                    res.cookie('token', token)

                    return res.json({status : "successful"})
                }else{
                    return res.json({error : "The email or password you've entered is invalid"})
                }
            })
        }else{
            return res.json({message : "Email doesn't exist"})
        }   
    })
})


module.exports = router