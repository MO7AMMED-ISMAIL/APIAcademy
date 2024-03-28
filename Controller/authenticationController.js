const bcrypt = require('bcrypt');
const teacherShema = require("../Model/teacherModel");
const jwt = require("jsonwebtoken");


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