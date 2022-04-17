const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { generateUserData } = require('../utils/helpers')
const tokenServices = require('../services/token.services')
const router = express.Router({mergeParams: true})

router.post('/signUp', async (req, res)=>{
    try {
        const {email, password} = req.body
        const exitingUser = await User.findOne({email})

        if (exitingUser) {
            return res.status(400).json ({
                error: {
                    message: 'EMAIL_EXISTS',
                    code: 400
                }
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            ...generateUserData(),
            ...req.body,
            password: hashedPassword
        })

       const tokens = tokenServices.generate({_id: newUser._id})
       await tokenServices.save(newUser._id, tokens.refreshToken)
       res.status(201).send({...tokens, userId: newUser._id})
    }
    catch(e){
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})


router.post('/signInWithPassword', async (req, res)=>{

})


router.post('/token', async (req, res)=>{

})


module.exports = router