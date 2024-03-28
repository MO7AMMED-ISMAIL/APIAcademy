const bcrypt = require('bcrypt');
const childShema = require("../Model/childModel");
const classShema = require("../Model/classModel");
const cloudinary = require('../cloudinaryConfig');

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


exports.createChild = async(req, res, next) => {
    try{
        if (!req.file) {
            return res.status(400).json({ error: 'No image file received.' });
        }
        const {fullName,age,level,address} = req.body;
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
        const newChild = new childShema(
            {
                fullName,
                age,
                level,
                address,
                image:cloudinaryResponse.secure_url
            }
        );
        const data = await newChild.save();
        res.status(201).json({Message: "chiled Created Succesfuly" , data});
    }catch(err){
        next(err);
    }
};


exports.updateChild = async(req, res, next) => {
    try{
        const id = req.body.id;
        const updateFields = {};
        if (req.body.fullName) updateFields.fullName = req.body.fullName;
        if (req.body.age) updateFields.age = req.body.age;
        if (req.body.level) updateFields.level = req.body.level;
        if (req.file) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
            let imgUrl = cloudinaryResponse.secure_url;
            updateFields.image = imgUrl;
        }
        const updateChild = await childShema.findByIdAndUpdate(id, updateFields, {new: true});
        if(!updateChild){
            res.status(404).json({data: "Child Not Found"})
        }
        res.status(200).json({message: "Child Updated Successfully", data: updateChild});
    }catch(err){
        next(err);
    }
};

exports.deleteChild = async(req, res, next) => {

    try{
        const id = req.params.id;
        const child = await childShema.findByIdAndDelete(id);
        if(!child){
            res.status(404).json({Message: "Child Not Found"})
        }
        const updateClass = await classShema.updateOne(
            {children: id},
            {$pull: {children: id}}
        );
        
        if(updateClass.nModified !== 0){
            res.status(200).json({Message: `Child Deleted Successfully from his Class`});
            return;
        }
        res.status(200).json({ message: 'Child deleted successfully' });
    }catch(err){
        next(err);
    }
};


