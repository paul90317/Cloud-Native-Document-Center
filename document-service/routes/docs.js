var express = require('express');
var router = express.Router();

const fs = require('fs');

// handlers modules
const authenticator = require('../handler/authenticator');
const documentSaver = require('../handler/documentSaver');

// database modules
const db = require('../models');

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Get filenames & ids of all docs uploaded by the user.
 * 
 *     description: Get filenames & ids of all docs uploaded by the user.
 * 
 *     security:
 *      - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                   id:
 *                     type: string
 *                   status:
 *                     type: integer
 *         description: A successful response
 * 
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.get('/all', authenticator.getUserInfo, (req, res) => {
  // find the account of the user
  db.sequelize.models.users.findOne({
    where: {
      email: req.email
    }
  }).then(user => {
    if (user) {
      // find all docs of the user
      db.sequelize.models.documents.findAll({
        where: {
          creator: user.account
        }
      }).then(docs => {
        // return the filename & id & status of all docs
        docs = docs.map(doc => {
          return {
            filename: doc.name,
            id: doc.id,
            status: doc.status
          }
        });
        res.send(docs);
      }).catch(err => {
        res.status(500).send(err);
      });
    } else {
      res.status(404).send('User not found');
    }
  })
});


/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new empty doc.
 * 
 *     description: This route is used to create a new doc.
 * 
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               creator:
 *                 type: string
 *                 description: Account of the creator of the document
 *               file:
 *                 type: string
 *                 format: binary
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *          text/plain:
 *           schema:
 *            type: string
 *         description: A successful response
 *
 *       '404':
 *         description: User not found
 * 
 *       '409':
 *         description: Document is already exist
 *
 *       '415':
 *         description: Unsupported media type
 */
router.post('/', authenticator.getUserInfo, documentSaver.single('file'), (req, res) => {
  // check if the creator is the same as the account of the user


  // check if the file is uploaded
  if (req.fileExists) {
    return res.status(409).send('File already exists');
  }

  // create a new doc
  db.sequelize.models.documents.create({
    name: req.body.filename,
    creator: req.body.creator,
    reviewer: req.body.creator,
    status: 0,
    message: ''
  }).then(doc => {
    res.send("Document created");
  }).catch(err => {
    res.status(500).send(err);
  });
});


/**
 * @swagger
 * /:id:
 *   get:
 *     summary: This route is used to get the doc that the user has uploaded.
 * 
 *     description: Will response the doc with the given id.
 * 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to get
 *         schema:
 *           type: string
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 review-id:
 *                   type: string
 *                 filename:
 *                   type: string
 *                 doc-id:
 *                   type: string
 *                 creator:
 *                   type: string
 *                 status:
 *                   type: string
 *                   description: The approval status of the document. 
 *                   enum: [draft, pending, approved, rejected]
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.get('/:id', authenticator.getUserInfo, (req, res) => {
  // check if the user is the document owner

  // return the doc
  db.sequelize.models.users.findOne({
    where: {
      email: req.email
    }
  }).then(user => {
    if (user) {
      // find the document name by id
      db.sequelize.models.documents.findOne({
        where: {
          id: req.params.id
        }
      }).then(doc => {
        if (doc) {
          const filePath = 'static/' + user.account + '/' + doc.name;
          if (!fs.existsSync(filePath)) {
            res.status(404).send('File not found');
          } else {
            res.sendFile(filePath, { root: './' });
          }
        } else {
          res.status(404).send('Document not found');
        }
      }).catch(err => {
        res.status(500).send(err);
      });
    } else {
      res.status(404).send('User not found');
    }
  })
});


/**
 * @swagger
 * /:id:
 *   put:
 *     summary: This route is used to update the doc with the given id.
 * 
 *     description: Will update the doc with the given id.
 * 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to get
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newFile:
 *                 type: string
 *                 format: binary
 *                 description: Binary data of the new file
 *               metadata:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                     description: Name of the new file
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.put('/:id', authenticator.getUserInfo, (req, res) => {
  res.send(req.email)
});


/**
 * @swagger
 * /:id:
 *   delete:
 *     summary: This route is used to delete the doc with the given id.
 * 
 *     description: Will delete the doc with the given id.
 * 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to get
 *         schema:
 *           type: string
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.delete('/:id', authenticator.getUserInfo, (req, res) => {
  res.send(req.email)
});


/**
 * @swagger
 * /review:
 *   post:
 *     summary: This route is used to create a new review.
 * 
 *     description: Will create a new review.
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doc-id:
 *                 type: string
 *               reviewer:
 *                 type: string
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   review-id:
 *                     type: string
 *                   filename:
 *                     type: string
 *                   doc-id:
 *                     type: string
 *                   creator:
 *                     type: string
 *                   reviewer:
 *                     type: string
 *                   status:
 *                     type: string
 *                     description: The approval status of the document. 
 *                     enum: [draft, pending, approved, rejected]
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.post('/review', authenticator.getUserInfo, (req, res) => {
  res.send(req.email)
});


/**
 * @swagger
 * /review:
 *   get:
 *     summary: This route is used to get a review with the given id.
 * 
 *     description: Will response the review with the given id.
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                   doc-id:
 *                     type: string
 *                   creator:
 *                     type: string
 *                   reviewer:
 *                     type: string
 *                   status:
 *                     type: string
 *                     description: The approval status of the document. 
 *                     enum: [draft, pending, approved, rejected]
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.get('/review/:id', authenticator.getUserInfo, (req, res) => {
  res.send(req.email)
});


/**
 * @swagger
 * /review:
 *   put:
 *     summary: This route is used to update a review with the given id.
 * 
 *     description: Will update a review with the given id
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The approval status of the document. 
 *                 enum: [draft, pending, approved, rejected]
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                   doc-id:
 *                     type: string
 *                   creator:
 *                     type: string
 *                   reviewer:
 *                     type: string
 *                   status:
 *                     type: string
 *                     description: The approval status of the document. 
 *                     enum: [draft, pending, approved, rejected]
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.put('/review/:id', authenticator.getUserInfo, (req, res) => {
  res.send(req.email)
});

/**
 * @swagger
 * /review/notification:
 *   get:
 *     summary: This route is used to get all reviews that the reviewer has to review.
 * 
 *     description: Will response all reviews that the reviewer has to review.
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                   creator:
 *                     type: string
 *                   reviewer:
 *                     type: string
 *                   doc-id:
 *                     type: string  
 *                   review-id:
 *                     type: string
 *                   status:
 *                     type: string
 *                     description: The approval status of the document. 
 *                     enum: [draft, pending, approved, rejected]
 *         description: A successful response
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.get('/review/notification', authenticator.getUserInfo, (req, res) => {
  res.send(req.email)
});


module.exports = router;