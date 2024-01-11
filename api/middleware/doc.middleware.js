import Document from '../models/document.model.js';

export const docValidator = async (req, res, next) => {
     const docId = req.params.id;
     const userId = req.headers.userid;

     try {
          const matchedDoc = await Document.findById(docId);

          if (!matchedDoc) return res.status(404).send({ message: "Document doesn't exist" });
          console.log("Author: ", matchedDoc.author.toString())
          console.log("userId: ", userId)
          if (matchedDoc.author.toString() !== userId) return res.status(400).send({ message: "You're unauthorized for this operation!" });
 
          next();


     } catch (error) {
          console.log('error:', error)
          res.status(500).send({
               message: error.message,
               error
          });
     }
}