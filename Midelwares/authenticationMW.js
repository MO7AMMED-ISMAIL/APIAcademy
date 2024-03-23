const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        let token = req.get('authorization').split(' ')[1];
        let decodedToken = jwt.verify(token, process.env.SECRETKEY);
        req.token = decodedToken;
        next();
    }catch(err){
        err.message = "not Athenticated";
        next(err);
    }
}


module.exports.isAdmin=(req, res, next)=>{
    if(req.token.role == 'admin'){
        next();
    }else{
        throw new Error('You are not authorized to access this data');
    }
}

module.exports.updateData = (req, res, next)=>{
    if(
        req.token.role == 'admin' || req.token._id == req.body._id){
        next();
    }else{
        throw new Error('You are not authorized to access this data');
    }
}

module.exports.isTeacher = (req, res, next)=>{
    if(req.token.role == 'teacher'){
        next();
    }else{
        throw new Error('You are not authorized to access this data');
    }
}


