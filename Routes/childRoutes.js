const express = require("express");
const router = express.Router();
const { 
    getAllChildern,
    getChildById,
    createChild,
    updateChild,
    deleteChild,
} = require("../Controller/ChildController");

const {
    insterChildValidator,
    updateChildValidator,
} = require("../Midelwares/ChildValidator/childValidator");

const resultValidator = require("../Midelwares/validatorResult");
const {isAdmin} = require("../Midelwares/authenticationMW")


router.route("/child")
    .get(isAdmin,getAllChildern)
    .post(isAdmin,insterChildValidator,resultValidator,createChild)
    .put(isAdmin,updateChildValidator,resultValidator,updateChild)


router.route('/child/:id')
    .get(isAdmin,getChildById)
    .delete(isAdmin,deleteChild);


module.exports = router;


