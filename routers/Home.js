const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')

router.get('/', (req, res)=>{
    console.log("user is loading contents [Time]: " + (new Date()))

    const post = `SELECT * FROM public_post OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`

    db.query(post , (err , result)=>{
        if(err) return console.log(err)
       // console.log(result)
        return res.json(result.rows)
    })

})



router.post('/comment' , (req, res)=>{

    const data = [ req.body.postid , req.body.userid , req.body.comment]

    const comment = 'INSERT INTO comments(post_id , user_id , user_comment) VALUES($1 , $2 , $3)'

    db.query(comment,data, (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successful : false})
        }
        if(result) return res.send({successful : true})
    })
})


router.get('/comment', (req, res)=>{
    const post_id = req.query.id

    const post_comment = `SELECT * FROM view_comments WHERE post_id = ${post_id} OFFSET ${req.query.current} LIMIT ${req.query.lastpage}`

    db.query(post_comment , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successful : false})
        }

        if(result){
            return res.send(result.rows)
        }

    })



})


module.exports = router