const express = require("express");
const router = express.Router();

const validateResulte = require("../Midelwares/validatorResult");
const {
    insertValidator,
} = require("../Midelwares/TeachersValidator/teacherValidator");

const {
    createTeacher,
    } = require("../Controller/TeacherController");

router.route("/register")
    .post(insertValidator,validateResulte,createTeacher);



module.exports = router;
