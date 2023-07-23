const userModel = require('../modules/userSchema')
const jwt = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/auth')


const test = (req, res) => {
    res.send('working')
}

const register = async (req, res) => {
    try {
        const { name, email, phone, password, cPassword } = req.body


        // Input Checks
        if (!name) { return res.json({ error: 'Name is required' }) }

        if (!email) { return res.json({ error: 'Email is required' }) }

        if (!phone) { return res.json({ error: 'Phone is required' }) }

        if (!password) {
            return res.json({
                error: 'password is required'
            })
        } else if (password.length < 8) { return res.json({ error: 'password should be at least 8 characters' }) }

        if (!cPassword) { return res.json({ error: 'Confirm your Password' }) }

        if (password != cPassword) { return res.json({ error: "confirm password does not match" }) }

        const exist = await userModel.findOne({ email })

        if (exist) {
            return res.status(400).json({ error: "Alread Exist" })
        }


        const hashedPassword = await hashPassword(password)


        const user = await userModel.create({
            name, email, phone, password: hashedPassword, cPassword: hashedPassword
        })

        return res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500)
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ error: "User not Exist" })
        }

        const match = await comparePassword(password, user.password)

        if (match) {

            jwt.sign({
                emai: user.email, id: user._id, name: user.name
            }, process.env.JWT_KEY, {}, (err, token) => {
                if (err) {
                    throw err
                }
                res.cookie('token', token).json(user)
            })
        } else {
            return res.json({ error: "Incorrect Password" })
        }
    } catch (err) {
        res.status(500)
    }
}


const getProfile = (req, res) => {
    const {token} = req.cookies

    console.log('working')

    //verify token
    if(token){
        jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
            if(err){
                throw err
            }else{
               return res.json(user)
            }
        })
    }else{
        res.json(null)
    }
}

module.exports = {
    test, register, login, getProfile
}