const db = require('../controllers/DB')


const register_log = (user_id) =>{

    const activity_log = `
        INSERT INTO register_log(user_id) VALUES(${user_id})
    `

    db.query(activity_log , (error , result)=>{
        if(error) return console.log(error)

        if(result) return console.log('register recorded.')
    })

}

module.exports = register_log