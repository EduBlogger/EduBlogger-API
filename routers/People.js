const express = require('express')
const db = require('../controllers/DB')
const router = express.Router()



router.get('/', (req, res)=>{
    const get_all_users = `
        SELECT * FROM user_profile WHERE user_id != ${req.user_data.user_id} ORDER BY 2 OFFSET ${req.query.current} LIMIT ${req.query.lastpage}
    `


    db.query(get_all_users , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows)

    })
})


module.exports = router