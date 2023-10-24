const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')

router.get('/', (req, res)=>{

    db.query('select * from blog_post' , (err , result)=>{

        res.json(result)
    })

})

module.exports = router