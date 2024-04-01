const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Register
 *   description: API endpoints for register teachers
 */
/**
 * @swagger
 *  /register:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Register]
 *     description: Create a new teacher with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: email
 *                 format: email
 *               password:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *               role:
 *                 type: string
 *                 enum: [teacher]
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - image
 *               - role
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: Teacher Created Susseccfuly
 *       400:
 *         description: Bad request. No image file received.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No image file received.
 *       500:
 *         description: Internal server error.
 */


const validateResulte = require("../Midelwares/validatorResult");
const {
    insertValidator,
} = require("../Midelwares/TeachersValidator/teacherValidator");

const {
    createTeacher,
    } = require("../Controller/TeacherController");

router.route("/register")
    .post(insertValidator,validateResulte,createTeacher);



module.exports = router;
