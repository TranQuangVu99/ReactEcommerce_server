const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ColorSchema = new Schema ({
    indexColor : String,
    nameColor : String,
    plusCost : Number
})

module.exports = Color = mongoose.model("color", ColorSchema)   