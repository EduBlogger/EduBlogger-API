const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')

router.get('/', (req, res)=>{

    db.query('select * from blog_post' , (err , result)=>{
        if(err) return console.log(err)
        console.log(result)
        return res.json(result)
    })

})

module.exports = router