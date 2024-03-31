const { body,param} = require("express-validator");


exports.insterChildValidator = [

    body('fullName').isString().isLength({ min: 3 }).withMessage('fullName must be at least 3 characters long'),

    body('age').isInt().withMessage('age must be a number'),

    body('level').isIn(['PreKG', 'KG1', 'KG2']).withMessage('level must be one of PreKG,KG1,KG2'),

    body('address').isObject().withMessage('address must be an object'),

    body('address.city').isLength({ min: 3 }).withMessage('city must be at least 3 characters long'),

];

exports.updateChildValidator = [
    body('id').isInt().withMessage('id must be a number'),

    body('fullName').isString().optional().isLength({ min: 3 }).withMessage('fullName must be at least 3 characters long'),

    body('age').optional().isInt().withMessage('age must be a number'),

    body('level').optional().isIn(['PreKG', 'KG1', 'KG2']).withMessage('level must be one of PreKG,KG1,KG2'),

    body('address').optional().isObject().withMessage('address must be an object'),

    body('address.city').optional().isLength({ min: 3 }).withMessage('city must be at least 3 characters long'),

];


exports.validatorIdParams = [
    param('id').isInt().withMessage('id is not valid'),
];
