const mongoose = require("mongoose")
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB}`).then(() => {
    console.log(`Database Connected`)
}).catch((e) => {
    console.log(`Database Connection Lost ${e}`)
})