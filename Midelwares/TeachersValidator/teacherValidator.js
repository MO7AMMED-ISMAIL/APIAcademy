const {body , param} = require('express-validator');

exports.insertValidator = [
    //body('_id').isMongoId().withMessage('id must be a object Mango id'),

    body('fullName').isString().withMessage('fullName must be a string').isLength({min: 3}).withMessage('fullname must be at least 3 characters long'),

    body('email').isEmail().withMessage('email must be a valid email address'),

    body('password').isLength({min: 6}).withMessage('password must be at least 6 characters long'),
    
    body('role').isIn(['admin','teacher']).withMessage('role must be admin or user'),

];

exports.updateValidator = [
    body('_id').isMongoId().withMessage('id is not valid'),

    body('fullName').optional().isString().withMessage('fullname must be a string').isLength({min: 3}).withMessage('fullname must be at least 3 characters long'),

    body('email').optional().isEmail().withMessage('email must be a valid email address'),

    body('password').optional().isLength({min: 6}).withMessage('password must be at least 6 characters long'),

    body('role').optional().isIn(['admin','teacher']).withMessage('role must be admin or user'),
];

exports.ChangePasswordValidator = [
    body('_id').isMongoId().withMessage('id is not valid'),

    body('oldPassword').isLength({min: 6}).withMessage('old password must be at least 6 characters long'),

    body('newPassword').isLength({min: 6}).withMessage('new password must be at least 6 characters long'),
];


exports.validatorIdParams = [
    param('id').isMongoId().withMessage('id is not valid'),
];

