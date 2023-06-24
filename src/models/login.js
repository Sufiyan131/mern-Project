const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// generating tokens
employeeSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        console.log(token)
        return token
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}

// password hashing

employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // console.log(`this is the password ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`this is the hashed password ${this.password}`)
        this.confirmPassword = await bcrypt.hash(this.password, 10)
    }
    next()
})

const Register = new mongoose.model("Register", employeeSchema)

module.exports = Register