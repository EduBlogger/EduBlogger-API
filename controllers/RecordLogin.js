const db = require('../controllers/DB')


const login_log = (user_id , attempt) =>{

    const activity_log = `
        INSERT INTO login_log(user_id , attempt) VALUES(${user_id} ,'${attempt}')
    `

    db.query(activity_log , (error , result)=>{
        if(error) return console.log(error)

        if(result) return console.log('login recorded.')
    })

}

module.exports = login_log