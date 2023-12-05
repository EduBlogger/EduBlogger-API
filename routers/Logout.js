const express = require('express')
const router = express.Router()


router.get('/' ,(req, res)=>{
    res.clearCookie('token')
    return res.json({status : 'successful'})
})

router.get('/admin' , (req, res)=>{
    res.clearCookie('adminToken')
    return res.json({status : 'successful'})
})


module.exports = router