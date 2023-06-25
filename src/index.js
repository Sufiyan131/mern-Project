require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const Register = require("./models/login")
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
require("./db/connection")
const port = process.env.PORT
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(express.static(path.join(__dirname, "../public")))
app.set("view engine", "hbs")
hbs.registerPartials(path.join(__dirname, "../partials"))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/logout", auth, async (req, res) => {
    try {
        // for single logout
        // req.user.tokens = req.user.tokens.filter((item) => {
        //     return item.token !== req.token
        // })

        //logout from all devices 
        req.user.tokens = []
        res.clearCookie("jwt")
        req.user.save()
        console.log("logout successfully")
        res.render("login")
    } catch (e) {
        res.status(401)
    }
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/secret", auth, (req, res) => {
    res.render("secret")
    // console.log(`this is a cookie ${req.cookies.jwt}`)
})

app.post("/", async (req, res) => {
    try {
        const { password, cpassword } = req.body
        if (password === cpassword) {
            const register = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmPassword: cpassword
            })

            const token = await register.generateAuthToken()
            console.log("the token " + token)
            res.cookie("jwt", token, {
                httpOnly: true,
                // expires: new Date(Date.now() + 30000)
            })
            const result = await register.save()
            console.log(result)
            res.status(201).render("login")

        } else {
            res.send("Password do not match")
        }
    } catch (e) {
        res.send(e).status(400)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Register.findOne({ email })
        console.log(user)
        const isMatch = await bcrypt.compare(password, user.password)
        const token = await user.generateAuthToken()
        console.log("the login token " + token)
        res.cookie("jwt", token, {
            httpOnly: true,
            // expires: new Date(Date.now() + 30000)
        })
        console.log(isMatch)
        if (user !== null && isMatch) {
            res.render("contact")
        } else {
            res.send("Invalid Email or Password")
        }
    } catch (e) {
        res.send(e).status(400)
    }
})


app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})