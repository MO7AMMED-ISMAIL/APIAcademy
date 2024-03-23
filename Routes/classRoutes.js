const express = require("express");
const router = express.Router();
const {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    getClassChlidern,
    getTeacherClass
} = require("../Controller/ClassController");

const {insterValidator,updateValidator} = require("../Midelwares/ClassValidator/classValidator");
const validateResulte = require("../Midelwares/validatorResult");
const {isAdmin} = require("../Midelwares/authenticationMW");

router.route('/class')
    .get(isAdmin,getAllClasses)
    .post(isAdmin,insterValidator,validateResulte,createClass)
    .put(isAdmin,updateValidator,validateResulte,updateClass)

router.get('/class/child/:id', getClassChlidern);
router.get('/class/teacher/:id', getTeacherClass);

router.route('/class/:id')
    .get(isAdmin,getClassById)
    .delete(isAdmin,deleteClass)


module.exports = router;
