const mongoose = require('mongoose')
const { model } = require('./color')
const Schema = mongoose.Schema

const PhotoSchema = new Schema ({
    photo : String,
})

module.exports = Photo = mongoose.model("photo", PhotoSchema)