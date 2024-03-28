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

const {
    insterValidator,
    updateValidator,
} = require("../Midelwares/ClassValidator/classValidator");
const validateResulte = require("../Midelwares/validatorResult");
const {isAdmin} = require("../Midelwares/authenticationMW");

router.route('/class')
    .all(isAdmin)
    .get(getAllClasses)
    .post(insterValidator,validateResulte,createClass)
    .put(updateValidator,validateResulte,updateClass)

router.get('/class/child/:id',isAdmin, getClassChlidern);
router.get('/class/teacher/:id', isAdmin, getTeacherClass);

router.route('/class/:id')
    .all(isAdmin)
    .get(getClassById)
    .delete(deleteClass)


module.exports = router;
