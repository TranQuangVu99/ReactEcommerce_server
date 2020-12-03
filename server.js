const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')


dotenv.config()

const app = express()


mongoose.connect(
    process.env.DATABASE,
    {
        useNewUrlParser : true, useUnifiedTopology: true
    },
    err =>{
        if(err){
            console.log(err)
        }
        else{
            console.log('Connected to the database...')
        }
    }
    )


//Middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(cors())

// require apis
const productRoutes = require('./routes/product')
const capacityRoutes = require('./routes/capacity')
const colorRoutes = require('./routes/color')
const photoRoutes = require('./routes/photo')
const userRoutes = require("./routes/auth")
const addressRoutes = require("./routes/address")
const paymentRoutes = require("./routes/payment")
const orderRoutes = require("./routes/order")


app.use('/api',productRoutes)
app.use('/api',capacityRoutes)
app.use('/api',colorRoutes)
app.use('/api',photoRoutes)
app.use('/api',userRoutes)
app.use('/api',addressRoutes)
app.use('/api',paymentRoutes)
app.use('/api',orderRoutes)

app.listen(5000,(err) =>{
    if(err){
        console.log(err)
    }else
    {
        console.log("Listening on PORT ",5000)
    }
})
