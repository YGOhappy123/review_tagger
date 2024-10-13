const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const DEFAULT_SERVER_ERROR_MSG = 'Oops! Something wrong!'
const BCRYPT_SALT = Number(process.env.SALTED_PASSWORD)
const MIN_PW_LENGTH = 6
const MAX_PW_LENGTH = 20

const userController = {
    register: async (req, res) => {
        try {
            const { username, password, fullName } = req.body
            if (!username || !password || !fullName) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required' })
            }
            if (
                password.length < MIN_PW_LENGTH ||
                password.length > MAX_PW_LENGTH
            ) {
                return res.status(400).json({
                    message: `Password must be between ${MIN_PW_LENGTH} and ${MAX_PW_LENGTH} characters`
                })
            }

            const duplicateUser = await User.findOne({ username }).collation({
                locale: 'en',
                strength: 2
            })
            if (duplicateUser) {
                return res.status(409).json({ message: 'Duplicate username' })
            }

            const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT)

            const newUser = await User.create({
                fullName,
                username,
                password: hashedPassword
            })

            const accessToken = jwt.sign(
                { data: newUser._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_LIFE }
            )

            const { password: _password, ...userData } = newUser._doc
            res.status(201).json({
                message: `New user ${username} created`,
                data: userData,
                token: accessToken
            })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body
            if (!username || !password) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required' })
            }

            const user = await User.findOne({ username })
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'This account is not exist' })
            }

            const isMatching = await bcrypt.compare(password, user.password)
            if (!isMatching) {
                return res.status(401).json({ message: 'Incorrect password' })
            }

            const accessToken = jwt.sign(
                { data: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_LIFE }
            )

            const { password: _password, ...userData } = user._doc
            res.status(200).json({
                message: 'Login success',
                data: userData,
                token: accessToken
            })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    changePassword: async (req, res) => {
        try {
            const { password, newPassword } = req.body
            if (!password || !newPassword) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required' })
            }

            const user = await User.findById(req.userId)
            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }

            const isMatching = await bcrypt.compare(password, user.password)
            if (!isMatching) {
                return res.status(401).json({ message: 'Incorrect password' })
            }

            const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT)
            user.password = hashedPassword
            await user.save()

            res.status(200).json({ message: 'Password updated successfully' })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    },

    getInfo: async (req, res) => {
        try {
            const user = await User.findById(req.userId).select('-password')
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            res.status(200).json({ data: user })
        } catch (err) {
            res.status(500).json({
                message: err.message ?? DEFAULT_SERVER_ERROR_MSG
            })
        }
    }
}

module.exports = userController
