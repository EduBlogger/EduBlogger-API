const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyAdmin = (req, res ,next) =>{
    const token = req.cookies.adminToken
    console.log("Admin Browser Token : " + token)
    if(!token) return res.json({error : 'unauthorized admin'})
    jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decoded)=>{
        if(err) return res.json({error : 'token expired'})

        res.clearCookie('adminToken')
        
        const key = decoded.key

        if(key == process.env.ADMIN_SESSION_KEY){
            const refresh_token = jwt.sign( {key : key } , process.env.JWT_SECRET_KEY , {expiresIn: '1h'})

            res.cookie('adminToken', refresh_token)

            return next()
        }else{
            return res.send({error : 'unauthorized admin'})
        }
    })
    
}

module.exports = verifyAdmin