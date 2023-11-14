const express = require('express')
const db = require('../controllers/DB')
const router = express.Router()

router.get('/', (req, res)=>{
    const user_id = req.query.id

    const get_user_profile = `SELECT * FROM user_profile WHERE user_id = ${user_id}`

    db.query(get_user_profile , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows[0])

    })    
})

router.get('/my_blogs',(req, res)=>{

    const get_my_blogs = `SELECT * FROM user_profile_blogs WHERE user_id = ${req.query.id}`

    db.query(get_my_blogs , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        return res.send(result.rows)
    })
})

module.exports = router