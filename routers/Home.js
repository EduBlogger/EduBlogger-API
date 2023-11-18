const express = require('express')
const router = express.Router()
const db = require('../controllers/DB')

router.get('/', (req, res)=>{
    console.log("user is loading contents [Time]: " + (new Date()))

    let blogs

    if(req.query.category != 'null'){
        console.log(req.query.category)
        blogs = `
            SELECT *
            FROM
            (SELECT DISTINCT f.* FROM follower_post f , follows fs WHERE fs.followed_id = f.user_id OR fs.follower_id = f.user_id AND fs.follower_id = ${req.query.user_id}
            UNION
            SELECT * FROM public_post) as blogs
            WHERE blogs.title ILIKE '%${req.query.search}%' AND category_id = ${req.query.category} 
            ORDER BY blogs.date_posted DESC
            OFFSET ${req.query.current} LIMIT ${req.query.lastpage}
        `
    }else{
        blogs = `
            SELECT *
            FROM
            (SELECT DISTINCT f.* FROM follower_post f , follows fs WHERE fs.followed_id = f.user_id OR fs.follower_id = f.user_id AND fs.follower_id = ${req.query.user_id}
            UNION
            SELECT * FROM public_post) as blogs
            WHERE blogs.title ILIKE '%${req.query.search}%' 
            ORDER BY blogs.date_posted DESC
            OFFSET ${req.query.current} LIMIT ${req.query.lastpage}
        `
    }


    db.query(blogs , (err , result)=>{
        if(err) return console.log(err)
        return res.json(result.rows)
    })

})

router.get('/blog', (req, res)=>{
    console.log("user is loading contents [Time]: " + (new Date()))


    const post = `
        SELECT *
        FROM
        (SELECT DISTINCT f.* FROM all_post f , follows fs WHERE f.status = 'follower' AND fs.followed_id = f.user_id OR fs.follower_id = f.user_id AND fs.follower_id = ${req.user_data.user_id} AND f.status = 'follower'
        UNION
        SELECT * FROM all_post WHERE status = 'public'
        UNION
        SELECT * FROM all_post private WHERE private.status = 'private' AND private.user_id = ${req.user_data.user_id}
        ) as blogs WHERE blogs.post_id = ${req.query.id}
    `

    db.query(post , (err , result)=>{
        if(err) return console.log(err)
        return res.json(result.rows)
    })

})

router.get('/raw/blog', (req, res)=>{
    console.log("user is loading contents [Time]: " + (new Date()))


    const post = `
        SELECT *
        FROM blog_post
        WHERE post_id = ${req.query.id} AND user_id = ${req.user_data.user_id}
    `

    db.query(post , (err , result)=>{
        if(err) return console.log(err)
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


router.post('/react', (req, res)=>{
    const data = {
        user_id : req.body.user_id,
        post_id : req.body.post_id,
    }


    const liked = `INSERT INTO liked(post_id , user_id) VALUES(${data.post_id} , ${data.user_id})`

    db.query(liked, (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successful : false})
        }
        if(result) return res.send({successful : true})
    })
})

router.post('/disreact', (req, res)=>{
    const data = {
        user_id : req.body.user_id,
        post_id : req.body.post_id,
    }


    const liked = `DELETE FROM liked WHERE user_id = ${data.user_id}  AND post_id = ${data.post_id}`

    db.query(liked, (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successful : false})
        }
        if(result) return res.send({successful : true})
    })
})


router.post('/isreact' , ( req, res)=>{
    const isliked = `
            SELECT user_id
            FROM  liked
            WHERE user_id = ${req.body.user_id} AND post_id = ${req.body.post_id}
        `

    db.query(isliked , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successful : false})
        }

        if(result.rowCount === 1){
            return res.send({successful : true})
        }else{
            return res.send({successful : false})
        }

    })
    
})

router.post('/save', (req, res)=>{
    const save_blog = `INSERT INTO saved(user_id , post_id) VALUES(${req.body.user_id}, ${req.body.post_id})`

    db.query(save_blog , (error , result)=>{
        if(error){
            console.log(error)
            res.send({successful : false})
        }

        if(result) return res.send({successful : true})

    })
})


router.post('/unsave', (req, res)=>{
    const unsave_blog = `DELETE FROM saved WHERE user_id=${req.body.user_id} AND post_id=${req.body.post_id}`

    db.query(unsave_blog , (error , result)=>{
        if(error){
            console.log(error)
            res.send({successful : false})
        }

        if(result) return res.send({successful : true})
        
    })
})


router.post('/issaved' , ( req, res)=>{
    const isSaved = `
            SELECT user_id
            FROM  saved
            WHERE user_id = ${req.body.user_id} AND post_id = ${req.body.post_id}
        `

    db.query(isSaved , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successful : false})
        }

        if(result.rowCount === 1){
            return res.send({successful : true})
        }else{
            return res.send({successful : false})
        }

    })
    
})


module.exports = router