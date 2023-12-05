const express = require('express')
const db = require('../controllers/DB')
const router = express.Router()

router.post('/' , (req , res)=>{
    const report = `INSERT INTO reports(user_id , report_content , post_id) VALUES(${req.user_data.user_id} , '${req.body.report}' , ${req.body.post_id})`

    db.query(report , (error , result)=>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }
        if(result) return res.send({successfull : true})
    })

})


router.post('/is_reported' , (req ,res)=>{
    const isReport = `
        SELECT * FROM reports WHERE post_id = ${req.body.post_id} AND user_id = ${req.user_data.user_id}
    `
    db.query(isReport , (error , result) =>{
        if(error){
            console.log(error)
            return res.send({successfull : false})
        }

        if(result.rowCount > 0){
            return res.send({successfull : true})
        }else{
            return res.send({successfull : false})
        }
    } )

})



module.exports = router