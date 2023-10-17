const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyUser = (req, res ,next) =>{
    const token = req.cookies.token
    if(!token) return res.json({error : "unauthorized user"})
    jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decoded)=>{
        if(err) return res.json({error : 'token expired'})
        req.name = decoded.name
        next()
    })
    
}


module.exports = verifyUser