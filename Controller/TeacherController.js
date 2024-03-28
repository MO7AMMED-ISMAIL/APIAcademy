const bcrypt = require('bcrypt');
const teacherShema = require('../Model/teacherModel');
const ClassShema = require('../Model/classModel');
const cloudinary = require('../cloudinaryConfig');
/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     description: Retrieve a list of all teachers.
 *     responses:
 *       200:
 *         description: A list of teachers.
 *       500:
 *         description: Internal server error MW Authitcated.
 */

exports.getAllTeachers = (req, res,next) => {
  teacherShema.find()
  .then(data=>res.status(200).json(data))
  .catch(err=>next(err));
}

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     description: Retrieve a teacher by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to retrieve.
 *         schema:
 *           type: MongoID
 *     responses:
 *       200:
 *         description: 
 *            The teacher object {id , name , email , password , image , role}.
 *             if is login is Admin 
 *       404:
 *         description: Teacher not found.
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
 * /api/teachers:
 *   post:
 *     summary: Create a new teacher
 *     description: Create a new teacher with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 *       400:
 *         description: Bad request - invalid parameters.
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
 * /api/teachers:
 *   put:
 *     summary: Update a teacher
 *     description: Update details of an existing teacher.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: MongoId
 *                 description: The ID of the teacher to update.
 *                 required: true
 *               fullName:
 *                 type: string
 *                 description: The updated full name of the teacher.
 *                 required: false
 *               email:
 *                 type: string (email)
 *                 description: The updated email address of the teacher.
 *                 required: false
 *               password:
 *                 type: string
 *                 description: The updated password of the teacher.
 *                 required: false
 *               file:
 *                 type: file
 *                 description: Optional. The updated image file of the teacher.
 *                 required: false
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
 *                   description: A message confirming the update.
 *                 data:
 *                   $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found.
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
 * /api/teachers/supervisors:
 *   get:
 *     summary: Get all supervisors
 *     description: Retrieve a list of all supervisors Data.
 *     responses:
 *       200:
 *         description: A list of supervisors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supervisors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Teacher'
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
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     description: Delete a teacher by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to delete.
 *         schema:
 *           type: mongoID
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
 *                   description: A message confirming the deletion.
 *       404:
 *         description: Teacher not found.
 *       500:
 *         description: Internal server error.
 */

exports.deleteTeacher = async(req, res, next) => {
  try{
    const id = req.params.id;
    const deletedTeacher = await teacherShema.findById(id);
    if(!deletedTeacher){
      res.status(200).json({"Message": "the Teacher Is not found"});
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
 * /api/teachers/changePass:
 *   post:
 *     summary: Change teacher's password
 *     description: Change the password of a teacher.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: MangoId
 *                 description: The ID of the teacher whose password is to be changed.
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the teacher.
 *               newPassword:
 *                 type: string
 *                 description: The new password for the teacher.
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
 *                 updatePass:
 *                   $ref: '#/components/schemas/Teacher'
 *       401:
 *         description: Old password is not valid.
 *       404:
 *         description: Teacher not found.
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
