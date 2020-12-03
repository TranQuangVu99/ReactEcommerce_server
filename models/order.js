const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const Schema = mongoose.Schema
const OrderSchema = new Schema({
    products : [
        {
            productID : { type : Schema.Types.ObjectId, ref : "product"},
            quantity : Number,
            price : Number,
            photo :String,
            colorName:String,
            capacity:Number
        }
    ],
    estimatedDelivery : Date,
    user : {type : Schema.Types.ObjectId, ref : "user"}
})

OrderSchema.plugin(deepPopulate)

module.exports = mongoose.model("Order", OrderSchema)