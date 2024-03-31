const bcrypt = require('bcrypt');
const teacherShema = require('../Model/teacherModel');
const ClassShema = require('../Model/classModel');
const cloudinary = require('../cloudinaryConfig');

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API endpoints for managing teachers
 */


/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     description: Retrieve a list of all teachers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                 - id: 786985c24vv56589
 *                   FullName: mohamed_ismail
 *                   role: admin
 *                   password: $2b$10$R0htEDimfE86Og.Kcin9fuqoQ7OhTHPVFAJFo0id1EdiRqWDOEc9C
 *                   email: mo7ismail@gmail.com
 *                   image: https://res.cloudinary.com/djqpidvlz/image/upload/v1711542078/  gx69xiqxgklfuoxensdn.png
 *       500:
 *         description: Internal server error.
 */

exports.getAllTeachers = (req, res,next) => {
  teacherShema.find()
  .then(data=>res.status(200).json(data))
  .catch(err=>next(err));
}

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     description: Retrieve a teacher by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to get Info
 *         schema:
 *           type: string
 *           format: mongoId
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                   id: 786985c24vv56589
 *                   FullName: mohamed_ismail
 *                   role: admin
 *                   password: $2b$10$R0htEDimfE86Og.Kcin9fuqoQ7OhTHPVFAJFo0id1EdiRqWDOEc9C
 *                   email: mo7ismail@gmail.com
 *                   image: https://res.cloudinary.com/djqpidvlz/image/upload/v1711542078/  gx69xiqxgklfuoxensdn.png
 *       404:
 *         description: Teacher not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: Teacher not found
 *       500:
 *         description: Internal server error.
 */

exports.getTeacherById = (req, res,next) => {
  const id = req.params.id;
  teacherShema.findById(id)
  .then(data=>{
    if(!data){
      res.status(404).json({data: "Teacher not found"});
    }
    res.status(200).json(data);
  })
  .catch(err=>next(err));
}

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     description: Create a new teacher with the provided information.
 *     security:
 *       - bearerAuth: []
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
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *               role:
 *                 type: string
 *                 enum: [teacher , admin]
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

exports.createTeacher = async(req, res, next) => {
  //res.status(200).json({body: req.body ,file: req.file });
  try{
    if (!req.file) {
      return res.status(400).json({ error: 'No image file received.' });
    }
    const { fullName, email, password, image, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    const newTeacher = new teacherShema(
      { fullName,
        email,
        password: hashedPassword,
        image: cloudinaryResponse.secure_url,
        role 
    });
    const data = await newTeacher.save();
    res.status(201).json({data});
  }catch(err){
    next(err);
  }
};

/**
 * @swagger
 * /teachers:
 *   put:
 *     summary: Update a teacher
 *     tags: [Teachers]
 *     description: Update a teacher with the provided information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 format: mongoId
 *                 example: 507f1f77bcf86cd799439011
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *             required:
 *               - _id
 *     responses:
 *       200:
 *         description: Teacher updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Teacher Updated Successfully
 *       404:
 *         description: Teacher not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: Teacher Not Found
 *       500:
 *         description: Internal server error.
 */

exports.updateTeacher = async(req, res, next) => {
  //res.status(200).json({body: req.body ,file: req.file });
  try{
    const id = req.body._id;
    const updateFields = {};
    if (req.body.fullName) updateFields.fullName = req.body.fullName;
    if (req.body.email) updateFields.email = req.body.email;
    if(req.body.password){
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateFields.password = hashedPassword;
    } 
    if (req.file) {
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
      let imgUrl = cloudinaryResponse.secure_url;
      updateFields.image = imgUrl;
    }
    const updatedTeacher = await teacherShema.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if(!updatedTeacher){
      res.status(404).json({data: "Teacher Not Found"});
    }
    res.status(200).json({message: "Teacher Updated Successfully", data: updatedTeacher});
  }catch(err){
    next(err);
  }
};

/**
 * @swagger
 * /teachers/supervisors:
 *   get:
 *     summary: Get all teachers supervisors
 *     tags: [Teachers]
 *     description: Delete a teacher by ID. Requires authentication via bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supervisors:
 *                   type: array
 *                   items: 
 *                     type: object
 *                     properties: 
 *                       _id: 
 *                         type: string
 *                         description: The ID of the supervisor.
 *                       fullName:
 *                         type: string
 *                         description: The full name of the supervisor.
 *                   example:
 *                     - _id: "6602fcdbbf4bd75cc29aafed"
 *                       fullName: "Mohamed Ismail89"
 *                     - _id: "66036147d30a76ce62e9c79f"
 *                       fullName: "ahmed Adel"
 *                     - _id: "6605805e6cef930d75465651"
 *                       fullName: "Nader Ahmed"
 *                     - _id: "6605805e6cef930d75465651"
 *                       fullName: "Nader Ahmed"
 *       500:
 *         description: Internal server error.
 */
exports.getAllsupervisors = (req, res, next) => {
  ClassShema.find({})
  .populate(
    {
      path:'supervisor', 
      select: {fullName: 1},
    }
    )
  .then(data=>{
    let supervisors = data.map(item=>item.supervisor);
    res.status(200).json({supervisors})
  })
  .catch(err=>next(err));
}

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     description: Delete a teacher by ID. Requires authentication via bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to delete.
 *         schema:
 *           type: string
 *           format: mongoId
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Teacher deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: A message confirming the deletion of the teacher.
 *                   example: Teacher is deleted Successfully
 *       404:
 *         description: Teacher Not Found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: A message confirming the teacher not found in the database.
 *                   example: Teacher Not Found
 *       500:
 *         description: Internal server error.
 */

exports.deleteTeacher = async(req, res, next) => {
  try{
    const id = req.params.id;
    const deletedTeacher = await teacherShema.findById(id);
    if(!deletedTeacher){
      res.status(404).json({"Message": "the Teacher Is not found"});
    }
    await ClassShema.updateMany({ supervisor: id }, { supervisor: req.token._id});
    await teacherShema.findByIdAndDelete(id);
    res.status(200).json({"Message": "Teacher Deleted Successfully"});
  }catch(err){
    next(err);
  }
}

/**
 * @swagger
 * /teachers/changePass:
 *   post:
 *     summary: Change teacher's password
 *     tags: [Teachers]
 *     description: Change the password of a teacher. Requires authentication via bearer token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 formate: mongoId
 *                 description: The ID of the teacher.
 *                 example: 66036147d30a76cgge62e9c7
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the teacher.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the teacher.
 *             required:
 *               - _id
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the password change.
 *                   example: change password sucssfuly
 *                 updatePass:
 *                   type: object
 *                   description: The updated teacher object.
 *       401:
 *         description: Unauthorized - Old password is not valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: the old password is not valid.
 *       404:
 *         description: Teacher not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The Teacher Is Not define.
 *       500:
 *         description: Internal server error.
 */

exports.changePassword = async (req , res ,next)=>{
  try{
    const {_id,newPassword,oldPassword} = req.body;

    const findTeacher = await teacherShema.findById(_id);
    if(!findTeacher){
      res.status(404).json({message: "Teacher Not Found"});
    }
    //check the old Password is valid or not 
    const isValidPassword = await bcrypt.compare(oldPassword, findTeacher.password);
    if(!isValidPassword){
      res.status(401).json({message: "Old Password is not valid"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update the password for this teacher
    const updatePass = await teacherShema.findByIdAndUpdate(_id, {password: hashedPassword},{new: true});
    res.status(200).json({message: "Password Changed Successfully",updatePass});

  }catch(err){
    next(err);
  }
}
