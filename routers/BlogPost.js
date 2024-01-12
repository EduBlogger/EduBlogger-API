const express = require('express')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')
const db = require('../controllers/DB')
const router = express.Router()
const fs = require('fs')
const activity_log = require('../controllers/RecordActivity')

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
      activity_log(req.user_data.user_id , `Blog with banner | ${data[0]} | status : ${data[4]} ` , 'POSTED')
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
  activity_log(req.user_data.user_id , `Blog no banner | ${data[0]} | status : ${data[3]} ` , 'POSTED')
  db.query(post_a_blog ,data, (err , result)=>{

    console.log(err)

    if(err) return res.send({message : 'error'}).status(500)

    if(result) return res.send({message : 'blog successfuly created'}).status(201)

  })
  

})

router.post('/edit', upload.single('blogBanner'), (req, res)=>{
  console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/blog/edit")
  
  const root = path.resolve(__dirname , '..')
  
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

    db.query(`SELECT * FROM blog_post WHERE post_id=${req.body.post_id} AND user_id = ${req.user_data.user_id}`, (error, result)=>{
      if(error){
        console.log(error)
        return res.send({successfull : false})
      }
      if(result.rows[0].blog_banner != null){
        fs.unlink(root+'/Public/images/upload/'+result.rows[0].blog_banner, error =>{
            if(error){
              console.log(error)
              return res.send({successfull : false})
            }
        })
      }

    })

    const edit_blog = 'UPDATE blog_post SET title = $1, content = $2, category_id = $3, blog_banner = $4, status = $5, user_id = $6 WHERE post_id = $7'

    db.query(edit_blog ,data, (err , result)=>{

      console.log(err)
      activity_log(req.user_data.user_id , `Blog with banner | ${data[0]} | status : ${data[4]} ` , 'UPDATE')
      if(err) return res.send({message : 'error'}).status(500)

      if(result) return res.send({message : 'blog successfuly edited'}).status(200)

    })
})


router.post('/edit_noBanner', (req, res)=>{
  console.log("[HTTP REQUIEST]: user is requiesting in Server :/api/blog/edit_noBanner")

  const root = path.resolve(__dirname , '..')

  console.log('root : ', root)
    
    const data = [
      req.body.blogTitle,
      req.body.blogBody,
      req.body.blogCategory,
      req.body.status,
      req.body.userID,
      req.body.post_id,
      req.user_data.user_id
    ]

    let edit_blog = ''

    db.query(`SELECT * FROM blog_post WHERE post_id=${req.body.post_id} AND user_id = ${req.user_data.user_id}`, (error, result)=>{
      if(error){
        console.log(error)
        return res.send({successfull : false})
      }

      if(req.query.image == 1){
        edit_blog = 'UPDATE blog_post SET title = $1, content = $2, category_id = $3, status = $4, user_id = $5, date_posted = NOW() WHERE post_id = $6 AND user_id = $7'
      }
      
      if(req.query.image == 0){
        edit_blog = 'UPDATE blog_post SET title = $1, content = $2, category_id = $3, blog_banner = null, status = $4, user_id = $5, date_posted = NOW() WHERE post_id = $6 AND user_id = $7'
        if(result.rows[0].blog_banner != null){
          fs.unlink(root+'/Public/images/upload/'+result.rows[0].blog_banner, error =>{
            if(error){
              console.log(error)
              return res.send({successfull : false})
            }
          })
        }
      }

      db.query(edit_blog ,data, (err , result)=>{

        if(err) {
          console.log(err)
          return res.send({message : 'error'}).status(500)
        }else{
          activity_log(req.user_data.user_id , `Blog no banner | ${data[0]} | status : ${data[3]} ` , 'UPDATE')
          if(result) return res.send({message : 'blog successfuly edited'}).status(200)
        }  
      })

    })

    console.log(data)
})


router.post('/change_aud' , (req, res)=>{

  console.log(req.body)

  const change_aud = `UPDATE blog_post SET status = '${req.body.status}' WHERE post_id = ${req.body.post_id} AND user_id = ${req.user_data.user_id}`


  db.query(change_aud , (error , result)=>{
    if(error) {
      console.log(error)
      return res.send({successfull : false})
    }
    activity_log(req.user_data.user_id , `Change Audience | status : ${req.body.status} ` , 'UPDATE')
    if(result) return res.send({successfull : true})

  })

})


router.post('/delete' , (req, res)=>{

  const delete_blog = `
    DELETE FROM comments WHERE post_id = ${req.body.post_id};
    DELETE FROM saved WHERE post_id = ${req.body.post_id};
    DELETE FROM liked WHERE post_id = ${req.body.post_id};
    DELETE FROM reports WHERE post_id = ${req.body.post_id};
    DELETE FROM blog_post WHERE post_id = ${req.body.post_id} AND user_id = ${req.user_data.user_id};
  `

  db.query(delete_blog ,(error , result)=>{
    if(error){
      console.log(error)
      return res.send({successfull : false})
    }
    activity_log(req.user_data.user_id , `Blog | Delete a blog ` , 'DELETED')
    if(result) return res.send({successfull : true})
  })


})






module.exports = router