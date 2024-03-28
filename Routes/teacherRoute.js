const express = require("express");
const router = express.Router();

const validateResulte = require("../Midelwares/validatorResult");
const {
  insertValidator,
  updateValidator,
  validatorIdParams,
  ChangePasswordValidator
} 
= require("../Midelwares/TeachersValidator/teacherValidator");

const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  getAllsupervisors,
  deleteTeacher,
  changePassword
} = require("../Controller/TeacherController");
const {isAdmin,updateData} = require("../Midelwares/authenticationMW");



router
  .route("/teachers")
  .get(isAdmin,getAllTeachers)
  .post(insertValidator, validateResulte,createTeacher)
  .put(updateData,updateValidator,validateResulte,updateTeacher);

router.route("/teachers/supervisors").get(isAdmin,getAllsupervisors);
router.route("/teachers/changePass").post(updateData,ChangePasswordValidator,validateResulte,changePassword);

router.route("/teachers/:id")
  .all(isAdmin)
  .get(validatorIdParams,validateResulte,getTeacherById)
  .delete(validatorIdParams,validateResulte,deleteTeacher);


module.exports = router;
