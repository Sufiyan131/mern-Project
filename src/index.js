require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const Register = require("./models/login")
const bcrypt = require("bcryptjs")
require("./db/connection")
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(express.static(path.join(__dirname, "../public")))
app.set("view engine", "hbs")
hbs.registerPartials(path.join(__dirname, "../partials"))

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/contact", (req, res) => {
    res.render("contact")
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