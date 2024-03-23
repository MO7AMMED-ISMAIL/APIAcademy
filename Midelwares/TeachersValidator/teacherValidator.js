const {body} = require('express-validator');


exports.insertValidator = [
    //body('_id').isMongoId().withMessage('id must be a object Mango id'),

    body('fullName').isString().withMessage('fullName must be a string').isLength({min: 3}).withMessage('fullname must be at least 3 characters long'),

    body('email').isEmail().withMessage('email must be a valid email address'),

    body('password').isLength({min: 6}).withMessage('password must be at least 6 characters long'),

    body('image').isString().withMessage('image must be a string'),

    body('role').isIn(['admin','teacher']).withMessage('role must be admin or user'),
];

exports.updateValidator = [
    //body('_id').isMongoId().withMessage('id must be a number'),

    body('fullName').optional().isString().withMessage('fullname must be a string').isLength({min: 3}).withMessage('fullname must be at least 3 characters long'),

    body('email').optional().isEmail().withMessage('email must be a valid email address'),

    body('password').optional().isLength({min: 6}).withMessage('password must be at least 6 characters long'),

    body('image').optional().isString().withMessage('image must be a string'),

    body('role').optional().isIn(['admin','teacher']).withMessage('role must be admin or user'),
];

