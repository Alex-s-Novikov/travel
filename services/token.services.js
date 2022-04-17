const jwt = require('jsonwebtoken')
const config = require('config')
const Token = require('../models/token')
class TokenService {
generate(payload){
const accessToken = jwt.sign(payload, config.get('accessSecret'), {
   expiresIn: '1h'
} )
const refreshToken = jwt.sign(payload, config.get('refreshSecret') )
return {
    accessToken, refreshToken, expiresIn: 3600}
}

async save(user, refreshToken){
const data = await Token.findOne({user: user})
if(data){
    data.refreshToken = refreshToken
    return data.save()
}
const token = await Token.create({user, refreshToken})
return token
}

}

module.exports = new TokenService()

module.exports = router