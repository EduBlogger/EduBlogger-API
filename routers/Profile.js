const express = require('express')
const db = require('../controllers/DB')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')
const router = express.Router()
const fs = require('fs')


router.use(express.urlencoded({extended : true}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'Public/images/user_profiles/'); 
    },
    filename: (req, file, cb) => {
      cb(null,`${Date.now()}-${uuid.v4()}${path.extname(file.originalname)}`);
    },
});
  
const upload = multer({storage})

router.get('/', (req, res)=>{
    const user_id = req.query.id

    const get_user_profile = `SELECT * FROM user_profile WHERE user_id = ${user_id}`

    db.query(get_user_profile , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows[0])

    })    
})

router.get('/my_blogs',(req, res)=>{

    let get_my_blogs = ''

    console.log('query id : ' + req.query.id + ' user_id: ' + req.user_data.user_id)

    if(req.query.id == req.user_data.user_id){
        get_my_blogs = `SELECT * FROM user_profile_blogs WHERE user_id = ${req.query.id} OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`
    }else{
        if(req.query.following === 'true'){
            console.log("is follow? : " + req.query.following)
            get_my_blogs = `SELECT * FROM user_profile_blogs WHERE user_id = ${req.query.id} AND status != 'private' OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`
        }else{
            console.log('only public is available to accesss')
            get_my_blogs = `SELECT * FROM user_profile_blogs WHERE user_id = ${req.query.id} AND status = 'public' OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`
        }
    }



    db.query(get_my_blogs , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        return res.send(result.rows)
    })
})

router.get('/my_likes', (req, res)=>{

    const get_my_likes = `
    SELECT * FROM liked INNER JOIN user_profile_blogs ON liked.post_id = user_profile_blogs.post_id AND liked.user_id = ${req.query.user_id}
    ORDER BY liked.date_liked DESC
    OFFSET ${req.query.current} LIMIT ${req.query.lastpage}
    ` 

    db.query(get_my_likes , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        return res.send(result.rows)
    })
})


router.get('/my_saved', (req, res)=>{

    const get_my_saved = `
    SELECT * FROM saved INNER JOIN user_profile_blogs ON saved.post_id = user_profile_blogs.post_id AND saved.user_id = ${req.query.user_id}
    ORDER BY saved.date_saved DESC
    OFFSET ${req.query.current} LIMIT ${req.query.lastpage}
    ` 

    db.query(get_my_saved , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        return res.send(result.rows)
    })
})

router.get('/my_draft', (req, res)=>{

    const my_draft = `SELECT * FROM blog_post WHERE status = 'draft' AND user_id=${req.user_data.user_id} OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`

    db.query(my_draft , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        return res.send(result.rows)
    })

})

router.get('/my', (req, res)=>{
    const get_user_profile = `SELECT first_name , middle_name ,last_name , user_profile_image , bio FROM users WHERE user_id = ${req.user_data.user_id}`

    db.query(get_user_profile , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows[0])

    })    
})



router.post('/save-profile-image', upload.single('user_profile'),  (req, res)=>{

    const root = path.resolve(__dirname , '..')

    const data = [
        req.body.fname,
        req.body.mname,
        req.body.lname,
        req.body.bio,
        req.file.filename,
        req.user_data.user_id
    ]


    console.log(data)

    const edit_user_profile = `
        UPDATE users SET 
        first_name = $1,
        middle_name = $2,
        last_name = $3,
        bio = $4,
        user_profile_image = $5
        WHERE user_id = $6
    `

    const select_profile_image = `SELECT user_profile_image FROM users WHERE user_id = ${req.user_data.user_id}`


    db.query(select_profile_image , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result.rows[0].user_profile_image != null){
            fs.unlink(root+'/Public/images/user_profiles/'+result.rows[0].user_profile_image, error =>{
                if(error){
                  console.log(error)
                  return res.send({successfull : false})
                }
              })
        }
        db.query(edit_user_profile , data , (error, result)=>{
            if(error) {
                console.log(error)
                return res.send({successfull : false})
            }
    
            if(result) return res.send({successfull : true})
        })
    })

})


router.post('/save-non-mult',  (req, res)=>{
    
    const data = [
        req.body.fname,
        req.body.mname,
        req.body.lname,
        req.body.bio,
        req.user_data.user_id
    ]


    console.log(data)

    const edit_user_profile = `
        UPDATE users SET 
        first_name = $1,
        middle_name = $2,
        last_name = $3,
        bio = $4
        WHERE user_id = $5
    `

    db.query(edit_user_profile , data , (error, result)=>{
        if(error) {
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send({successfull : true})
    })
})


router.get('/image' , (req, res)=>{
    const select_profile_image = `SELECT user_profile_image FROM users WHERE user_id = ${req.user_data.user_id}`

    db.query(select_profile_image , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send({image : result.rows[0].user_profile_image})
    })
})


module.exports = router