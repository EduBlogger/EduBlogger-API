const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyUser = (req, res ,next) =>{
    const token = req.cookies.token
    if(!token) return res.json({error : 'unauthorized user'})
    jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decoded)=>{
        if(err) return res.json({error : 'token expired'})

        res.clearCookie('token')
        
        req.name = decoded.name
        
        const user_name = req.name
        
        const refresh_token = jwt.sign({user_name} , process.env.JWT_SECRET_KEY , {expiresIn: '15s'})
        
        res.cookie('token', refresh_token)
        
        next()
    })
    
}

module.exports = verifyUser