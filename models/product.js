const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema ({
    name : String,
    priceOnSales : Number,
    priceOnPurchase : Number,
    description : String,
    installment : Boolean,
    oldPrice : Number,
    bonusTitle : String,
    bonusContent : String,
    isExists:Boolean,
    screen : String,
    operatingSystem : String,
    frontCamera : String,
    backCamera : String,
    CPU : String,
    RAM : String,
    batteryCapacity : String,
    SIM : String,
    colors : [{color:{type : Schema.Types.ObjectId, ref : 'color'},image:{type : Schema.Types.ObjectId, ref : 'photo'}}],
    capacities : [{type : Schema.Types.ObjectId, ref : 'capacity'}],
})

module.exports =Product = mongoose.model("product", ProductSchema)
