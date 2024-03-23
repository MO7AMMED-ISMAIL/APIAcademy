const mongoose = require('mongoose');
const autoIncrement = require('@alec016/mongoose-autoincrement');

autoIncrement.initialize(mongoose.connection);

const addressSchema = new mongoose.Schema({
    city: {type: String,required: true},
    street: {type: String,required: true},
    building: {type: String}
},{_id: false});

const childSchema = new mongoose.Schema({
    _id:{type: Number ,unique: true},
    fullName: {type: String, required: true},
    age: {type: Number, required: true},
    level: {
        type: String,
        enum:['PreKG', 'KG1', 'KG2'],
        required: true
    },
    address:addressSchema
});

childSchema.plugin(autoIncrement.plugin, {
    model: 'childs',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});
module.exports = mongoose.model('childs', childSchema);



