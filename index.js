require('dotenv').config()
const express = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
const app = express()
const auth = require('./controllers/Auth')
const admnAuth = require('./controllers/AdminAuth')
const port = process.env.PORT


app.use(express.json())

app.use(cors({
    origin: [process.env.ORIGIN_URL , process.env.ADMIN_URL, process.env.ORIGIN_URL2],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials : true
}));


/* const allowedOrigins = [process.env.ORIGIN_URL , process.env.ADMIN_URL, process.env.ORIGIN_URL2];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log(origin)

  // Check if the requesting origin is in the list of allowed origins
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }

  next();
}); */


  

app.options('*', cors());

app.use(cookie())


app.use(express.static('Public'))
app.use(express.static('Public/images/upload'))
app.use(express.static('Public/images/user_profiles'))



/* public apis */
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



/* private apis */


/* user side route */
const blog = require('./routers/BlogPost')
app.use('/api/blog', auth, blog)

const home = require('./routers/Home')
app.use('/api/home' ,auth, home)

const profile = require('./routers/Profile')
app.use('/api/profile' ,auth, profile)

const follow = require('./routers/Follow')
app.use('/api/follow' ,auth, follow)

const users = require('./routers/People')
app.use('/api/users', auth, users)

const report = require('./routers/Report')
app.use('/api/report', auth, report)


/* admin side route */
const admin = require('./routers/Admin')
app.use('/api/admin', admnAuth , admin)


app.listen( port , ()=>{
    console.log("Server is running in port: " + port)
})