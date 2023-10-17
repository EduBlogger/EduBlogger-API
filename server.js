require('dotenv').config()
const express = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT


app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials : true 
}));

app.use(cookie())



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



app.listen( port , ()=>{
    console.log("Server is running in port: " + port)
})