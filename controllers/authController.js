const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res) => { 
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await User.create({
            username,
            password: hashedPassword
        })

        req.session.user = newUser // Set the session information

        res.status(201).json({
            status: 'success',
            data: newUser
        })
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                error: 'User was not found'
            })
        }

        const matched = await bcrypt.compare(password, user.password) // Compare the password hashes
        if (matched) {
            req.session.user = user

            res.status(200).json({
                status: 'success'
            })
        } else {
            res.status(400).json({
                status: 'failed',
                error: 'Password incorrect'
            })
        }
    } catch (err) {
        console.log(`Error: ${err}`)

        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}