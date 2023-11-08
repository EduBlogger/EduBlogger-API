const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyUser = (req, res ,next) =>{
    const token = req.cookies.token
    if(!token) return res.json({error : 'unauthorized user'})
    jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decoded)=>{
        if(err) return res.json({error : 'token expired'})

        res.clearCookie('token')
        
        const userdata = decoded.userdata

        req.user_data = userdata
        
        const refresh_token = jwt.sign( {userdata : userdata } , process.env.JWT_SECRET_KEY , {expiresIn: '30d'})
        
        res.cookie('token', refresh_token)
        
        next()
    })
    
}

module.exports = verifyUser