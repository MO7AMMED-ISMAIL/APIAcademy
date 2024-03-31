const bcrypt = require('bcrypt');
const teacherShema = require("../Model/teacherModel");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 *  tags:
 *   name: Authentication
 *   description: To Login Admin and Teacher
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as a teacher
 *     tags: [Authentication]
 *     description: Authenticate and generate a JWT token for the teacher.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the teacher.
 *               password:
 *                 type: string
 *                 description: The password of the teacher.
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: A message indicating successful authentication.
 *                   example: Authenticated
 *                 token:
 *                   type: string
 *                   description: JWT token for accessing protected routes.
 *       401:
 *         description: Unauthorized - Incorrect username or password.
 *       500:
 *         description: Internal server error.
 */


exports.login = async(req,res,next)=>{
    try{
        const { fullName, password} = req.body;
        const teacher = await teacherShema.findOne({ fullName});
        if (!teacher) {
            throw new Error('Teacher not found or incorrect UserName');
        }
        const isMatch = await bcrypt.compare(password, teacher.password);
        if(isMatch){
            const token = jwt.sign({
                _id: teacher._id,
                role: teacher.role
            }, process.env.SECRETKEY, { expiresIn: '1h' });
            res.json({ data: "Authenticated", token });
        }
    }catch(err){
        next(err);
    }
}