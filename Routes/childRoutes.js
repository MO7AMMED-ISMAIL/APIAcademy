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
    validatorIdParams
} = require("../Midelwares/ChildValidator/childValidator");

const resultValidator = require("../Midelwares/validatorResult");
const {isAdmin} = require("../Midelwares/authenticationMW")


router.route("/child")
    .all(isAdmin)
    .get(getAllChildern)
    .post(insterChildValidator,resultValidator,createChild)
    .put(updateChildValidator,resultValidator,updateChild)


router.route('/child/:id')
    .all(isAdmin,validatorIdParams,resultValidator)
    .get(getChildById)
    .delete(deleteChild);


module.exports = router;


