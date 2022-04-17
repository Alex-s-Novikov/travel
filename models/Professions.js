const {Schema, model} = require('mongoose')

const schema = new Schema({
        name: {
            type: String,
            require: true,
        },

}, {
    timestamps: true
})

module.exports = model('Proffessions', schema)