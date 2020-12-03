const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CapacitySchema = new Schema ({
    capacity : Number,
    plusCost : Number
})

module.exports = Capacity = mongoose.model("capacity", CapacitySchema)
