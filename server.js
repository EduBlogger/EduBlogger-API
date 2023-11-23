require('dotenv').config()
const express = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
const app = express()
const auth = require('./controllers/Auth')
const port = process.env.PORT


app.use(express.json())

app.use(cors({
    origin: process.env.ORIGIN_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials : true ,
    proxy: process.env.ORIGIN_URL
}));

app.use(cookie())


app.use(express.static('Public'))
app.use(express.static('Public/images/upload'))
app.use(express.static('Public/images/user_profiles'))



const login = require('./routers/Login')
app.use('/api/login', login)    

const register = require('./routers/Register')
app.use('/api/register',  register)

const token = require('./routers/Token')
app.use('/api/token', token)

const forgot = require('./routers/Forgot')
app.use('/api/forgot', forgot)

const logout = require('./routers/Logout')
app.use('/api/logout', logout)

const blog = require('./routers/BlogPost')
app.use('/api/blog', auth, blog)

const home = require('./routers/Home')
app.use('/api/home' ,auth, home)

const profile = require('./routers/Profile')
app.use('/api/profile' ,auth, profile)

const follow = require('./routers/Follow')
app.use('/api/follow' ,auth, follow)

app.listen( port , ()=>{
    console.log("Server is running in port: " + port)
})