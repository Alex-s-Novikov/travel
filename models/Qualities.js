const {Schema, model} = require('mongoose')

const schema = new Schema({
        name: {
            type: String,
            require: true,
        },
        color: {
            type: String,
            require: true,
        }

}, {
    timestamps: true
})

module.exports = model('Qualities', schema)