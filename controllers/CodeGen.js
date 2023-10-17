const crypto = require('crypto')


const generateCode = () =>{
    const randomBuffer = crypto.randomBytes(Math.ceil(5 / 2))
    const hash = randomBuffer.toString('hex').slice(0 , 5)
    return hash
}

module.exports = generateCode