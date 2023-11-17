const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')

router.post('/add' , (req, res)=>{
    const follow = `INSERT INTO follows(followed_id , follower_id) VALUES(${req.body.followed_id}, ${req.body.follower_id})`

    db.query(follow , (error , result)=>{
        if(error){
            console.log(error)
            return res.json({successfull : false})
        }

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

module.exports = router