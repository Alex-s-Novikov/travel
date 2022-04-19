const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const { generateUserData } = require('../utils/helpers')
const tokenServices = require('../services/token.services')
const router = express.Router({ mergeParams: true })


const signUpValidations = [

]

router.post('/signUp', [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),

    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: "INVALID_DATA",
                        code: 400,
                        errors: errors.array()
                    }
                })
            }
            const { email, password, rate } = req.body
            const exitingUser = await User.findOne({ email })

            if (exitingUser) {
                return res.status(400).json({
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

            const tokens = tokenServices.generate({ _id: newUser._id })
            await tokenServices.save(newUser._id, tokens.refreshToken)
            res.status(201).send({ ...tokens, userId: newUser._id, rate })
        }
        catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    }])


router.post('/signInWithPassword', [
    check('email', 'Email некорректный').normalizeEmail().isEmail(),
    check('password', 'Пароль не может быть пустым').exists(),
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: 'INVALID_DATA',
                        code: 400
                    }
                })
            }
            const { email, password } = req.body
            const existingUser = await User.findOne({ email })
            if (!existingUser) {
                return res.status(400).send({
                    error: {
                        message: 'EMAIL_NOT_FOUND',
                        code: 400
                    }
                })

            }
            const isPasswordEqual = await bcrypt.compare(password, existingUser.password)
            if (!isPasswordEqual) {
                return res.status(400).send({
                    error: {
                        message: 'INVALID_PASSWORD',
                        code: 400
                    }
                })
            }
            const tokens = tokenServices.generate({ _id: existingUser._id })
            await tokenServices.save(existingUser._id, tokens.refreshToken)


            res.status(200).send({ ...tokens, userId: existingUser._id })

        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    }])


router.post('/token', async (req, res) => {

})


module.exports = router