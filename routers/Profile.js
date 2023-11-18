const express = require('express')
const db = require('../controllers/DB')
const router = express.Router()

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



module.exports = router