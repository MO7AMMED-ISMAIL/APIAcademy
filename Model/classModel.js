const mongoose = require('mongoose');
const autoIncrement = require('@alec016/mongoose-autoincrement');

autoIncrement.initialize(mongoose.connection);

const classModel = new mongoose.Schema({
    _id: {type: Number , required: true, unique: true},
    name: {type: String , required: true},
    supervisor: {type:  mongoose.Schema.Types.ObjectId , required: true, ref : 'teachers'},
    children: [{type: Number , required: true, ref: 'childs'}]
});

classModel.plugin(autoIncrement.plugin, {
    model: 'classes',
    startAt: 1,
    incrementBy: 1,
    field: '_id'
});

module.exports = mongoose.model('classes', classModel);