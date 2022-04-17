const professionMock = require('../mock/professions.json')
const qualitiesMock = require('../mock/qualities.json')
const Professions = require('../models/Professions')
const Qualities = require('../models/Qualities')

module.exports = async () => {
    const professions = await Professions.find()
    if (professions.length !== professionMock.length){
        createInitialEntity(Professions, professionMock)
    }
}

module.exports = async () => {
    const qualities = await Qualities.find()
    if (qualities.length !== qualitiesMock.length){
        createInitialEntity(Qualities, qualitiesMock)
    }
}

async function createInitialEntity(Model, data){
    await Model.collection.drop()
    return Promise.all(
        data.map(async item => {
try {
delete item._id 
const newItem = new Model(item)
await newItem.save()
return newItem
} catch(e) {
return e
}
        })
    )
}