const bcrypt = require('bcrypt');
const teacherShema = require('../Model/teacherModel');
const ClassShema = require('../Model/classModel');
const cloudinary = require('../cloudinaryConfig');


exports.getAllTeachers = (req, res,next) => {
  teacherShema.find()
  .then(data=>res.status(200).json(data))
  .catch(err=>next(err));
}

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
