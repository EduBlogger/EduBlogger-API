const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')
const activity_log = require('../controllers/RecordActivity')

router.post('/add' , (req, res)=>{
    const follow = `INSERT INTO follows(followed_id , follower_id) VALUES(${req.body.followed_id}, ${req.body.follower_id})`

    db.query(follow , (error , result)=>{
        if(error){
            console.log(error)
            return res.json({successfull : false})
        }
        activity_log(req.user_data.user_id , `Follow | Followed a user` , 'ADDED')
        if(result) return res.json({successfull : true})
    })
    

})

router.post('/remove' , (req, res)=>{
    const follow = `DELETE FROM follows WHERE followed_id = ${req.body.followed_id} AND follower_id = ${req.body.follower_id}`

    db.query(follow , (error , result)=>{
        if(error){
            console.log(error)
            return res.json({successfull : false})
        }
        activity_log(req.user_data.user_id , `Follow | Unfollow a user` , 'DELETED')
        if(result) return res.json({successfull : true})
    })
})

router.get('/isfollowed' , (req, res)=>{
    console.log('follwed_id ' + req.query.followed_id + ' follower_id ' + req.query.follower_id)
    const isfollowed = `SELECT * FROM follows WHERE followed_id=${req.query.followed_id} AND follower_id = ${req.query.follower_id}`

    db.query(isfollowed , (error , result)=>{
        if(error){
            console.log(error)
            return res.json({successfull : false})
        }
        if(result.rowCount != 0) return res.json({successfull : true})
        if(result.rowCount == 0) return res.json({successfull : false})
    })

})


router.get('/get_my_follower' ,(req , res)=>{
    const get_follower =    `SELECT full_name , user_id , user_profile_image FROM user_profile u , follows f
    WHERE u.user_id = f.follower_id AND f.followed_id = ${req.user_data.user_id} ORDER BY f.date_of_follow DESC`

    db.query(get_follower , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows)
    })
})

router.get('/get_my_following' ,(req , res)=>{
    const get_follower =    `SELECT full_name , user_id , user_profile_image FROM user_profile u , follows f
    WHERE u.user_id = f.followed_id AND f.follower_id = ${req.user_data.user_id} ORDER BY f.date_of_follow DESC`

    db.query(get_follower , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows)
    })
})

module.exports = router