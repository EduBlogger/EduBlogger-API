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
      req.body.status,
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


router.post('/no_banner', (req ,res)=>{
  console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/blog")
  
  const data = [
    req.body.blogTitle,
    req.body.blogBody,
    req.body.blogCategory,
    req.body.status,
    req.body.userID
  ]

  console.log(data)

  const post_a_blog = 'INSERT INTO blog_post (title, content, category_id, status , user_id) VALUES($1, $2, $3, $4, $5)'

  db.query(post_a_blog ,data, (err , result)=>{

    console.log(err)

    if(err) return res.send({message : 'error'}).status(500)

    if(result) return res.send({message : 'blog successfuly created'}).status(201)

  })
  

})

router.post('/edit', upload.single('blogBanner'), (req, res)=>{
  console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/blog/edit")
    
    const data = [
      req.body.blogTitle,
      req.body.blogBody,
      req.body.blogCategory,
      req.file.filename,
      req.body.status,
      req.body.userID,
      req.body.post_id
    ]

    console.log(data)

    const edit_blog = 'UPDATE blog_post SET title = $1, content = $2, category_id = $3, blog_banner = $4, status = $5, user_id = $6 WHERE post_id = $7 AND '

    db.query(edit_blog ,data, (err , result)=>{

      console.log(err)

      if(err) return res.send({message : 'error'}).status(500)

      if(result) return res.send({message : 'blog successfuly edited'}).status(200)

    })
})


router.post('/edit_noBanner', (req, res)=>{
  console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/blog/edit_noBanner")
    
    const data = [
      req.body.blogTitle,
      req.body.blogBody,
      req.body.blogCategory,
      req.body.status,
      req.body.userID,
      req.body.post_id,
      req.user_data.user_id
    ]

    console.log(data)

    const edit_blog = 'UPDATE blog_post SET title = $1, content = $2, category_id = $3, blog_banner = null, status = $4, user_id = $5 WHERE post_id = $6 AND user_id $7'

    db.query(edit_blog ,data, (err , result)=>{

      console.log(err)

      if(err) return res.send({message : 'error'}).status(500)

      if(result) return res.send({message : 'blog successfuly edited'}).status(200)

    })
})


router.post('/change_aud' , (req, res)=>{

  const change_aud = `UPDATE blog_post SET status = ${req.body.status} WHERE post_id = ${req.body.post_id} AND ${req.user_data.user_id}`


  db.query(change_aud , (error , result)=>{
    if(error) {
      console.log(error)
      return res.send({successfull : false})
    }

    if(result) return res.send({successfull : true})


  })

})


router.post('/delete' , (req, res)=>{



  const delete_blog = ``

  db.query(delete_blog ,(error , result)=>{
    if(error){
      console.log(erorr)
      return res.send({successfull : false})
    }
    if(result) return res.send({successfull : true})
  })


})




module.exports = router