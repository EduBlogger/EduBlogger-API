const express = require('express')
const router = express.Router()

const verifyUser = require('../controllers/Auth')

router.get('/' ,verifyUser, (req, res)=>{
    return res.json({status : "successful", name : req.name})
})

module.exports = router