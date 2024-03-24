const childShema = require("../Model/childModel");
const classModel = require("../Model/classModel");
const classChema = require("../Model/classModel");

exports.getAllChildern = (req, res, next) => {
    childShema.find()
    .then(data=>res.status(200).json(data))
    .catch(err=>next(err));
};


exports.getChildById = (req, res, next) => {
    const id = req.params.id;
    childShema.findById(id)
    .then(data=>{
        if(!data){
            return res.status(404).json({message:'child not found'});
        }
        res.status(200).json(data);
    })
    .catch(err=>next(err));
};


exports.createChild = (req, res, next) => {
    // delete req.body._id;
    if(req.body._id != undefined){
        return res.status(400).json({message:'id is Auto increment'});
    }
    const newChild = new childShema(req.body);
    newChild.save()
    .then(data=>res.status(201).json(data))
    .catch(err=>next(err));
};


exports.updateChild = (req, res, next) => {
    const id = req.body._id;
    childShema.findByIdAndUpdate(id, req.body, {new: true})
    .then(data=>{
        if(!data){
            res.status(404).json({message: 'child not found'});
        }
        res.status(200).json({data : 'updated sucessfully'});
    })
    .catch(err=>next(err));
};

exports.deleteChild = (req, res, next) => {
    const id = req.params.id;
    childShema.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).json({message: 'child not found'});
        }
        res.status(200).json({data : 'deleted sucessfully'});
    })
    .catch(err=>next(err));
};


