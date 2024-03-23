const teacherShema = require('../Model/teacherModel');
const ClassShema = require('../Model/classModel');

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

exports.createTeacher = (req, res, next) => {
  const newTeacher = new teacherShema(req.body);
  newTeacher.save()
  .then(data => res.status(201).json({data}))
  .catch(err => next(err));
};


exports.updateTeacher = (req, res, next) => {
  const id = req.body._id;
  teacherShema.findByIdAndUpdate(id, req.body, {new: true})
  .then(data => {
    if(!data){
      res.status(404).json({data: "Teacher not found"});
    }
    res.status(200).json({data: "updated Successful"});
  }).catch(err => next(err));
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


exports.deleteTeacher = (req, res, next) => {
  const id = req.params.id;
  teacherShema.findByIdAndDelete(id)
  .then(data => {
    if(!data){
      res.status(404).json({data: "Teacher not found"});
    }
    res.status(200).json({data: "deleted Successful"});
  }).catch(err => next(err));
}

