const jwt = require('jsonwebtoken')
const db = require('../controllers/DB')
require('dotenv').config()
const verifyUser = (req, res ,next) =>{
    const token = req.cookies.token
    if(!token) return res.json({error : 'unauthorized user'})
    jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decoded)=>{
        if(err) return res.json({error : 'token expired'})

        res.clearCookie('token')
        
        const userdata = decoded.userdata

        req.user_data = userdata

        db.query('SELECT * FROM users WHERE user_id = ' + userdata.user_id, (error , result)=>{

            if(error) return res.json({error : 'unauthorized user'})

            if(result.rowCount == 0) {
                return res.json({error : 'unauthorized user'})
            }else{
                const refresh_token = jwt.sign( {userdata : userdata } , process.env.JWT_SECRET_KEY , {expiresIn: '30d'})
        
                res.cookie('token', refresh_token)
        
                return next()
            }
        })
        
        
    })
    
}

module.exports = verifyUser