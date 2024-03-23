const express = require("express");
const router = express.Router();
const validateResulte = require("../Midelwares/validatorResult");
const {insertValidator , updateValidator} = require("../Midelwares/TeachersValidator/teacherValidator");
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  getAllsupervisors,
  deleteTeacher,
} = require("../Controller/TeacherController");
const {isAdmin,updateData} = require("../Midelwares/authenticationMW");



router
  .route("/teachers")
  .get(isAdmin,getAllTeachers)
  .post(isAdmin,insertValidator, validateResulte, createTeacher)
  .put(updateData,updateValidator,validateResulte,updateTeacher);

router.route("/teachers/supervisors").get(isAdmin,getAllsupervisors)

router.route("/teachers/:id")
  .all(isAdmin)
  .get(getTeacherById)
  .delete(deleteTeacher);





module.exports = router;
