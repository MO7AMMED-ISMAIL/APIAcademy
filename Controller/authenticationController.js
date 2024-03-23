const teacherShema = require("../Model/teacherModel");
const jwt = require("jsonwebtoken");

exports.login = (req,res,next)=>{
    teacherShema.findOne({
        fullName: req.body.fullName,
        password: req.body.password,
    })
    .then(teacher => {
        if(!teacher){
            throw new Error('User not found');
        }

        let token = jwt.sign({
            _id: teacher._id,
            role: teacher.role
        },
        process.env.SECRETKEY,
        {expiresIn: '1h'}
        )
        res.json({data: "Authenticated", token});
    })
    .catch(err=>next(err));
}