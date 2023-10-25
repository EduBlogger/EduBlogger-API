const express = require('express')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')
const db = require('../controllers/DB')
const router = express.Router()


router.use(express.urlencoded({extended : true}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'Public/images/upload/'); 
    },
    filename: (req, file, cb) => {
      cb(null,`${Date.now()}-${uuid.v4()}${path.extname(file.originalname)}`);
    },
});
  

const upload = multer({ storage });


router.post('/', upload.single('blogBanner'), (req ,res)=>{
    console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/blog")
    
    const data = {
      blogTitle : req.body.blogTitle,
      blogCategory : req.body.blogCategory,
      blogBody : req.body.blogBody,
      blogBanner : req.file.filename,
      userID : req.body.userID
    }

    console.log(data)

    const post_a_blog = `INSERT INTO blog_post (title, content, category_id , blog_banner, status , user_id) VALUES('${data.blogTitle}' ,'${data.blogBody}', ${data.blogCategory} , '${data.blogBanner}' , 'public'  , ${data.userID} )`

    db.query(post_a_blog , (err , result)=>{

      console.log(err)

      if(err) return res.send({message : 'error'}).status(500)

      return res.send({message : 'blog successfuly created'}).status(201)

    })
    

})



module.exports = router