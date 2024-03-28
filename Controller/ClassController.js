const classShema = require("../Model/classModel");
const childShema = require("../Model/childModel");


async function checkDuplicateChildren(childrenToAdd , classId=0){
    let existingClasses;
    if(classId === 0){
        existingClasses = await classShema.find({children: {$in: childrenToAdd}});
    }else{
        existingClasses= await classShema.find(
            { children: { $in: childrenToAdd }, _id: { $ne: classId }}
        );
    }
    if(existingClasses.length > 0){
        const existingChildIds = existingClasses.map(cls => cls.children).flat();
        const duplicateChildIds = childrenToAdd.filter(childId => existingChildIds.includes(childId));
        return duplicateChildIds;
    }
    return [];
}


exports.getAllClasses = (req,res,next)=>{
    classShema.find({})
    .populate({path:'supervisor', select: {_id:0,fullName: 1}})
    .populate({path: 'children' , select: {_id:0,fullName: 1}})
    .then((data)=>res.status(200).json({data}))
    .catch((err)=>next(err));
};

exports.getClassById = (req,res,next)=>{
    const id = req.params.id;
    classShema.findById(id).
    populate({path:'supervisor', select: {_id:0,fullName: 1}})
    .populate({path: 'children' , select: {_id:0,fullName: 1}})
    .then(data=>{
        if(!data){
            return res.status(404).json({message:"Class Not Found"});
        }
        res.status(200).json({data})
    })
    .catch(err=>next(err))
};

exports.createClass = async(req,res,next)=>{
    try{
        const {name , children , supervisor} = req.body;
        //check duplicate children
        const duplicateChildIds = await checkDuplicateChildren(children);
        if (duplicateChildIds.length > 0) {
            return res.status(400).json({ message: `Children ${duplicateChildIds.join(', ')} already belong to another class` });
        }
        const newClass = new classShema(
            {
                name:name,
                supervisor:supervisor,
                children:children
            }
        );
        await newClass.save();
        res.status(200).json({message:"Class Created"});
    }
    catch(err){
        next(err)
    }
};

exports.updateClass = async(req,res,next)=>{
    try{
        const {id, name , children , supervisor} = req.body;
        const duplicateChildIds = await checkDuplicateChildren(children, id);
        if (duplicateChildIds.length > 0) {
            return res.status(400).json({ message: `Children ${duplicateChildIds.join(', ')} already belong to another class` });
        }
        const updatedClass = await classShema.findByIdAndUpdate(
            id,
            { $set: { name, supervisor, children } },
            { new: true }
        );
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ message: 'Class updated successfully', data: updatedClass });
    }catch(err){
        next(err);
    }
};

exports.deleteClass = (req,res,next)=>{
    const id = req.params.id;
    classShema.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).json({message:"Not found"});
        }
        res.status(200).json({message:  "Deleted Successful"});
    }).catch(err=>next(err));
};


exports.getClassChlidern = async(req,res,next)=>{
    try{
        const classID = req.params.id;
        const classInfo = await classShema.findById(classID);
        if(!classInfo){
            return res.status(200).json({message:"Class not found"});
        }
        const className = classInfo.name;
        const childrenIds = classInfo.children;
        const childrenInfo = await childShema.find({ _id: { $in: childrenIds } });

        if (!childrenInfo || childrenInfo.length === 0) {
            return res.status(404).json({ message: "No children found for this class" });
        }
        res.status(200).json({ name:className, childrenInfo });
    }catch(err){
        next(err);
    }
};

exports.getTeacherClass = (req,res,next)=>{
    const classID = req.params.id;
    classShema.findById(classID).populate('supervisor')
    .then((data)=>{
        if(!data){
            return res.status(404).json({message:"Class not found"});
        }
        res.status(200).json({class: data.name,supervisor: data.supervisor})
    }).catch(err=>next(err));
}

