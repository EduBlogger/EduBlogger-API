const db = require('../controllers/DB')


const activity = (user_id , activity_info , activity ) =>{

    const activity_log = `
        INSERT INTO activity(user_id , activity_info , activity) VALUES(${user_id} , '${activity_info}' , '${activity}')
    `

    db.query(activity_log , (error , result)=>{
        if(error) return console.log(error)

        if(result) return console.log('activity recorded.')
    })

}

module.exports = activity