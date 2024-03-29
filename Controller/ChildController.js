const bcrypt = require('bcrypt');
const childShema = require("../Model/childModel");
const classShema = require("../Model/classModel");
const cloudinary = require('../cloudinaryConfig');

/**
 * @swagger
 *  tags:
 *   name: Childs
 *   description: API endpoints for managing Childs
 */

/**
 * @swagger
 * /api/child:
 *   get:
 *     summary: Get all children
 *     tags: [Childs]
 *     description: Retrieve a list of all children.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token (Bearer token)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               example:
 *                - _id: 26
 *                  fullName: amir
 *                  age: 5
 *                  level: KG1
 *                  address:
 *                    city: cairo
 *                    street: 11 Main St
 *                    building: Apt 103
 *       500:
 *         description: Internal server error.
 */

exports.getAllChildern = (req, res, next) => {
    childShema.find()
    .then(data=>res.status(200).json(data))
    .catch(err=>next(err));
};

/**
 * @swagger
 * /api/Childs/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Childs]
 *     description: Retrieve a Child by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: params
 *         name: id
 *         required: true
 *         description: ID of the teacher to get Info
 *         schema:
 *           type: number
 *           example: 5
 *       - in: header
 *         name: Authorization
 *         description: Access token (Bearer token)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                - _id: 26
 *                  fullName: amir
 *                  age: 5
 *                  level: KG1
 *                  address:
 *                    city: cairo
 *                    street: 11 Main St
 *                    building: Apt 103
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

/**
 * @swagger
 * /api/childs:
 *   post:
 *     summary: Create a new child
 *     tags: [Childs]
 *     description: Create a new child with provided information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token (Bearer token)
 *         required: true
 *         schema:
 *           type: string
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the child.
 *               age:
 *                 type: number
 *                 description: The age of the child.
 *               level:
 *                 type: enum
 *                 format: [ PreKEG  KG1  KG2 ]
 *                 description: The level of the child.
 *               address:
 *                 type: object
 *                 format: {city- street- buliding}
 *                 example: {city:mans,street:123,buliding:any}
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: The city of the child's address.
 *                   street:
 *                     type: string
 *                     description: The street of the child's address.
 *                   building:
 *                     type: string
 *                     description: The building of the child's address.
 *               image:
 *                 type: file
 *                 format: binary
 *                 description: The image of the child.
 *     responses:
 *       201:
 *         description: Child created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: A message confirming the child creation.
 *                   example: Child created successfully
 *                 data:
 *                   type: object
 *                   description: The created child object.
 *       400:
 *         description: Bad request - No image file received.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating no image file received.
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /api/childs:
 *   put:
 *     summary: Update a child
 *     tags: [Childs]
 *     description: Update information of a child by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token (Bearer token)
 *         required: true
 *         schema:
 *           type: string
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: The ID of the child to update.
 *               fullName:
 *                 type: string
 *                 description: The full name of the child.
 *               age:
 *                 type: number
 *                 description: The age of the child.
 *               level:
 *                 type: string
 *                 enum: [ PreKEG, KG1, KG2 ]
 *                 description: The level of the child.
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: The city of the child's address.
 *                   street:
 *                     type: string
 *                     description: The street of the child's address.
 *                   building:
 *                     type: string
 *                     description: The building of the child's address.
 *               image:
 *                 type: file
 *                 format: binary
 *                 description: The image of the child.
 *     responses:
 *       200:
 *         description: Child updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the child update.
 *                   example: Child updated successfully
 *                 data:
 *                   type: object
 *                   description: The updated child object.
 *       404:
 *         description: Child not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: Child not found
 *       500:
 *         description: Internal server error.
 */

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

/**
 * @swagger
 * /api/childs/{id}:
 *   delete:
 *     summary: Delete a child
 *     tags: [Childs]
 *     description: Delete a child by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Access token (Bearer token)
 *         required: true
 *         schema:
 *           type: string
 *       - in: params
 *         name: id
 *         required: true
 *         description: ID of the child to delete.
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Child deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: A message confirming the deletion of the child.
 *                   example: Child deleted successfully
 *       404:
 *         description: Child not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: A message indicating the child was not found.
 *                   example: Child not found
 *       500:
 *         description: Internal server error.
 */

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


