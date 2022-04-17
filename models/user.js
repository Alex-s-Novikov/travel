const {Schema, model} = require('mongoose')

const schema = new Schema({
name: {type: String},
email:{type: String, required: true, unique: true},
password:{type: String},
completedMeetings:Number,
image: String,
professions: {type: Schema.Types.ObjectId, ref: 'Professions'},
qualities: [{type: Schema.Types.ObjectId, ref: 'Qualities'}],
rate: Number,
sex: {type: String, enum: ['man', 'woman']}
}, {
    timestamps: true
})

module.exports = model('User', schema)


