const mongosse = require("mongoose");

const teacherSchema = mongosse.Schema({
    fullName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    image: {type: String, required: true},
    role: { type: String, enum: ['admin', 'teacher'], required: true},
});

const teacher = mongosse.model("teachers", teacherSchema);

module.exports = teacher;
