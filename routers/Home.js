const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')

router.get('/', (req, res)=>{
    console.log("user is loading contents [Time]: " + (new Date()))

    const post = `SELECT * FROM public_post`

    db.query(post , (err , result)=>{
        if(err) return console.log(err)
       // console.log(result)
        return res.json(result)
    })

})

module.exports = router