const express = require('express')
const db = require('../controllers/DB')

const router = express.Router()


router.get('/' , (req, res)=>{
    res.send({successfull : true})
})


router.get('/users' , (req, res)=>{
    const users = `
    SELECT user_id , CONCAT(first_name , ' ' , last_name) as full_name , email , TO_CHAR(date_joined , 'Mon DD YYYY') as date_join
    FROM users 
    ORDER BY date_joined DESC
    `

    db.query(users , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result) return res.send(result.rows)
    })
})


router.delete('/users/:id' , (req, res)=>{

    const get_all_user_post =  `
    SELECT post_id
    FROM blog_post WHERE user_id = ${req.params.id}
    `

    db.query(get_all_user_post , (error , post)=>{
        if(error) return console.log(error)


        if(post){
            post.rows.forEach(post => {
                const delete_blog_relation = `
                    DELETE FROM saved WHERE post_id = ${post.post_id};
                    DELETE FROM liked WHERE post_id = ${post.post_id};
                    DELETE FROM comments WHERE post_id = ${post.post_id};
                    DELETE FROM reports WHERE post_id = ${post.post_id}
                `
                db.query(delete_blog_relation , (error , blog)=>{
                    if(error) return console.log(error)
                })
                
            });
        }
    })
    const delete_user = `
    DELETE FROM follows WHERE followed_id = ${req.params.id};
    DELETE FROM follows WHERE follower_id = ${req.params.id};
    DELETE FROM reports WHERE user_id = ${req.params.id};
    DELETE FROM liked WHERE user_id = ${req.params.id};
    DELETE FROM saved WHERE user_id = ${req.params.id};
    DELETE FROM comments WHERE user_id = ${req.params.id};
    DELETE FROM blog_post WHERE user_id = ${req.params.id};
    DELETE FROM users WHERE user_id = ${req.params.id};
    `
    db.query(delete_user , (error , result)=>{
        if(error) return console.log(error)
    })
    return res.send({successfull : true})
})



router.get('/activity_log' , (req, res)=>{
    const activity = `
    SELECT a.* , CONCAT(u.first_name , ' ' , u.last_name) full_name , u.email, CONCAT(TO_CHAR(a.date_time , 'Mon DD YYYY') , ' ' , TO_CHAR(a.date_time, 'HH:MI AM')) date_time
    FROM activity a , users u
    WHERE a.user_id = u.user_id
    ORDER BY a.date_time DESC
    `
    db.query(activity , (error , result)=>{
        if(error) return console.log(error)
        return res.send(result.rows)
    })


})


router.get('/login_log' , (req, res)=>{
    const login =  `
    SELECT  CONCAT(u.first_name , ' ' , u.last_name) full_name , u.email , TO_CHAR(l.date_time , 'Mon DD YYYY') date_log , TO_CHAR(l.date_time, 'HH:MI AM') time_log , l.attempt
    FROM login_log l , users u
    WHERE u.user_id = l.user_id
    ORDER BY l.date_time DESC

    `

    db.query(login , (error , result)=>{
        if(error) return console.log(error)
        return res.send(result.rows)
    })
})


router.get('/register_log' , (req ,res)=>{
    const register = `
    SELECT  CONCAT(u.first_name , ' ' , u.last_name) full_name , u.email , TO_CHAR(l.date_time , 'Mon DD YYYY') date , TO_CHAR(l.date_time, 'HH:MI AM') time
    FROM register_log l , users u
    WHERE u.user_id = l.user_id
    ORDER BY l.date_time DESC
    `

    db.query(register , (error , result)=>{
        if(error) return console.log(error)
        return res.send(result.rows)
    })
})

router.get('/reports_log' , (req ,res)=>{
    const report = `
    SELECT b.post_id, b.title , b.status , c.category_name , CONCAT(u.first_name , ' ' , u.last_name) full_name , TO_CHAR(b.date_posted , 'Mon DD, YYYY HH:MI AM') as date_posted, COUNT(r.report_id) as report_count
    FROM blog_post b INNER JOIN users u ON b.user_id = u.user_id INNER JOIN category c ON c.category_id = b.category_id INNER JOIN reports r ON r.post_id = b.post_id
    GROUP BY b.post_id , c.category_name , u.first_name , u.last_name , b.date_posted
    ORDER BY b.date_posted DESC
    `
    db.query(report , (error , result)=>{
        if(error) return console.log(error)
        return res.send(result.rows)
    })

})


router.get('/reports_log/:id' , (req ,res)=>{
    const report = `
    SELECT  r.post_id, CONCAT(u.first_name , ' ' , u.last_name) full_name , u.email , r.report_content
    FROM reports r INNER JOIN users u ON u.user_id = r.user_id
    WHERE r.post_id = ${req.params.id}
    `
    db.query(report , (error , result)=>{
        if(error) return console.log(error)
        return res.send(result.rows)
    })
})

router.put('/block/:id' , (req ,res)=>{
    const block =  `
    UPDATE blog_post SET status = 'block' WHERE post_id = ${req.params.id}
    `
    db.query(block , (error , result)=>{
        if(error) return console.log(error)
        if(result) return res.send({successfull: true})
        return res.send({successfull : false})
    })
})

router.put('/unblock/:id' , (req ,res)=>{
    const block =  `
    UPDATE blog_post SET status = 'private' WHERE post_id = ${req.params.id}
    `
    db.query(block , (error , result)=>{
        if(error) return console.log(error)
        if(result) return res.send({successfull: true})
        return res.send({successfull : false})
    })
})

router.get('/dashboard' , (req ,res)=>{

    const dashboard = `
    SELECT 
    ((SELECT COUNT(b.post_id) FROM blog_post b)) total_blogs,
    ((SELECT COUNT(u.user_id) FROM users u)) total_users,
    ((SELECT COUNT(r.report_id) FROM reports r)) total_reports
    `
    db.query(dashboard , (error , result)=>{
        if(error) return console.log(error)
        return res.send(result.rows)
    })

})




module.exports = router