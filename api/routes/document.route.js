import express from 'express';
import { docValidator } from '../middleware/doc.middleware.js';
import { getAllDocs, getUserSpecificDocs, postDoc, updateDoc, deleteDoc } from '../controllers/document.controller.js';
import authCheck from '../middleware/auth.middleware.js';
const docsRouter = express.Router();

// Routes for handling general document operations
docsRouter.route('/')
     .get(authCheck, getAllDocs) // Route for retrieving all documents
     .post(authCheck, postDoc); // Route for creating a new document


docsRouter.use(authCheck) // authentication validator

// Routes for handling document operations with a specific ID
docsRouter.route('/:id')
     .patch(docValidator, updateDoc) // Route for updating a document
     .delete(docValidator, deleteDoc); // Route for deleting a document

// Route for retrieving documents specific to a user
docsRouter.route('/user').get(authCheck, getUserSpecificDocs);


export default docsRouter;