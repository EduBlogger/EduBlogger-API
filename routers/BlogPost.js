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
    
    const data = [
      req.body.blogTitle,
      req.body.blogBody,
      req.body.blogCategory,
      req.file.filename,
      'public',
      req.body.userID
    ]

    console.log(data)

    const post_a_blog = 'INSERT INTO blog_post (title, content, category_id , blog_banner, status , user_id) VALUES($1, $2, $3, $4, $5, $6)'

    db.query(post_a_blog ,data, (err , result)=>{

      console.log(err)

      if(err) return res.send({message : 'error'}).status(500)

      if(result) return res.send({message : 'blog successfuly created'}).status(201)

    })
    

})



module.exports = router