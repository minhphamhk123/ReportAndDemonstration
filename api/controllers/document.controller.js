import Document from '../models/document.model.js';
import User from '../models/user.model.js';


// GET all documents which are publically available
export const getAllDocs = async (req, res) => {
     try {
          const publicDocs = await Document.find({ isPublic: true }).select('-doc').populate('author', '-password');
          res.status(200).send({ message: "Success", data: publicDocs });
     } catch (error) {
          console.log('error:', error)
          res.status(500).send({
               message: error.message,
               error
          });
     }
}


// GET all documents created by a logged in user
export const getUserSpecificDocs = async (req, res) => {
     const userId = req.headers.userid;
     console.log("userId: ", userId)
     try {
          //const docs = await Document.find({ author: userId });
          const docs = await Document.find({ author: userId }).populate('author', '-password');
          // const user = await User.find({_id: userId})
          res.status(200).send({ message: "Success", data: docs });
     } catch (error) {
          console.log('error:', error)
          res.status(500).send({
               message: error.message,
               error
          });
     }
}


// GET Single document 
export const getSingleDoc = async (docId) => {

     try {
          const matchedDoc = await Document.findById(docId);
          console.log("DocID: ", docId)
          if (!matchedDoc) return { message: "Document doesn't exist!" };

          return { message: "success", doc: matchedDoc };
     } catch (error) {
          console.log('error:', error)
          return { message: error.message };
     }
}


// POST a document
export const postDoc = async (req, res) => {
     const userId = req.headers.userid;
     // console.log("userId: ", userId)
     // console.log("\nheaders: ", req.headers, "\n")
     const { title, doc } = req.body;

     if (!title) return res.sendStatus(400);

     try {
          const newDoc = new Document({ ...req.body, author: userId })
          await newDoc.save();

          res.status(201).send({ message: 'Document created successfully', data: newDoc });
     } catch (error) {
          console.log('error:', error)
          res.status(500).send({
               message: error.message,
               error
          });
     }
}


// UPDATE a document created by that logged-in user only
export const updateDoc = async (req, res) => {
     const docId = req.params.id;
     const update = req.body;

     try {

          const updatedDoc = await Document.findByIdAndUpdate(docId, update, { new: true, runValidators: true });
          /*
          In the second object:
          - The `new` key will help to get the updated document reference returned, not the old one.
          - The `runValidators` key strictly forces following the schema validation.
          */

          res.status(202).send({ message: `${updatedDoc.title} is successfully updated`, data: updatedDoc });


     } catch (error) {
          console.log('error:', error)
          res.status(500).send({
               message: error.message,
               error
          });
     }
}


// DELETE a document created by that logged-in  user only
export const deleteDoc = async (req, res) => {
     const docId = req.params.id;
     const userId = req.headers.userId;

     try {

          const deletedDoc = await Document.findByIdAndDelete(docId);

          res.status(202).send({ message: `${deletedDoc.title} is successfully deleted` });

     } catch (error) {
          console.log('error:', error)
          res.status(500).send({
               message: error.message,
               error
          });
     }
}