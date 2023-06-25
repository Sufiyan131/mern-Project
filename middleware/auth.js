const jwt = require("jsonwebtoken")
const Register = require("../src/models/login")

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyUser = await jwt.verify(token, process.env.SECRET_KEY)
        console.log(verifyUser)
        const user = await Register.findOne({ _id: verifyUser._id })
        // console.log(user)
        req.token = token
        req.user = user
        console.log("this is user " + req.user)
        next()
    } catch (e) {
        res.status(401).send(e)
    }
}

module.exports = auth