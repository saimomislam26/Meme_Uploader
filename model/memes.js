const { Schema, model } = require('mongoose');
let time = new Date()
const memeSchema = new Schema({
    author: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },

    Date: {
        type: Date,
        default: time.toLocaleDateString()
    }
})


const Meme = model('meme', memeSchema)

module.exports.Meme = Meme;