const { body } = require("express-validator");
const teacherShema = require("../../Model/teacherModel");
const childShema = require("../../Model/childModel");

exports.insterValidator = [
    //body("id").isInt().withMessage("id must be a number"),
    body("name").isString().isLength({ min: 3 }).withMessage("name must be at least 3 chars long"),
    body("supervisor").isMongoId().withMessage("supervisor must be a number").custom(
        async(value)=>{
            const supervisorExists = await teacherShema.exists({ _id: value });
            if(!supervisorExists){
                throw new Error("supervisor doesn't exist");
            }
            return true;
        }),

    body("children").isArray().withMessage("children must be an array").custom(arr=>arr.length > 2).withMessage("class must have at least 2 child").custom(async(children)=>{
        const invalidID = [];
        //getAll
        for(let childID of children){
            const childExists = await childShema.exists({ _id: childID });
            if(!childExists){
                invalidID.push(childID);
            }
        }
        if(invalidID.length > 0){
            throw new Error(`child with id ${invalidID.join(', ')} doesn't exist in table Childs`);
        }
        return true;
    }),
];

exports.updateValidator = [
    //body("id").isInt().withMessage("id must be a number"),

    body("name").optional().isString().isLength({ min: 3 }).withMessage("name must be at least 3 chars long"),

    body("supervisor").optional().isMongoId().withMessage("supervisor must be a number").custom(
        async(value)=>{
            const supervisorExists = await teacherShema.exists({ _id: value });
            if(!supervisorExists){
                throw new Error("supervisor doesn't exist");
            }
            return true;
        }),

    body("children").optional().isArray().withMessage("children must be an array").custom(arr=>arr.length > 2).withMessage("class must have at least 2 child").custom(arr=>arr.length > 2).withMessage("class must have at least 2 child").custom(async(children)=>{
        const invalidID = [];
        for(let childID of children){
            const childExists = await childShema.exists({ _id: childID });
            if(!childExists){
                invalidID.push(childID);
            }
        }
        if(invalidID.length > 0){
            throw new Error(`child with id ${invalidID.join(', ')} doesn't exist in table Childs`);
        }
        return true;
    }),
];