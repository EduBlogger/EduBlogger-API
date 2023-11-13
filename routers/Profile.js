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

module.exports = router