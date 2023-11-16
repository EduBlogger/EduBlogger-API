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

    const get_my_blogs = `SELECT * FROM user_profile_blogs WHERE user_id = ${req.query.id} OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`

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
    SELECT l.post_id , u.*
    FROM liked l , (
        SELECT * FROM user_profile_blogs OFFSET ${req.query.current} LIMIT ${req.query.lastpage} 
    ) as u
    WHERE l.user_id = ${req.query.user_id} AND u.post_id = l.post_id
    ORDER BY l.date_liked DESC
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
    SELECT s.post_id , u.*
    FROM saved s , (
        SELECT * FROM user_profile_blogs OFFSET ${req.query.current} LIMIT ${req.query.lastpage} 
    ) as u
    WHERE s.user_id = ${req.query.user_id} AND u.post_id = s.post_id
    ORDER BY s.date_saved DESC
    ` 

    db.query(get_my_saved , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        return res.send(result.rows)
    })
})



module.exports = router