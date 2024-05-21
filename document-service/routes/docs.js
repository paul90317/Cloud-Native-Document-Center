var express = require('express');
var router = express.Router();

const fs = require('fs');

// handlers modules
const authenticator = require('../handler/authenticator');
const documentSaver = require('../handler/documentSaver');
const documentUpdator = require('../handler/documentUpdator');

// database modules
const db = require('../models');

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Get docnames & ids of all docs uploaded by the user.
 * 
 *     description: Get docnames & ids of all docs uploaded by the user.
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
 *                   docname:
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
        // return the docname & id & status of all docs
        docs = docs.map(doc => {
          return {
            docname: doc.name,
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
 *               docname:
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
    name: req.body.docname,
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
 * /{id}:
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
 *                 docname:
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
 * /{id}:
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
*                docname:
*                  type: string
*                  description: Name of the new file
 *               newFile:
 *                 type: string
 *                 format: binary
 *                 description: Binary data of the new file
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
router.put('/:id', authenticator.getUserInfo, documentUpdator.single('newFile'), (req, res) => {
  if (req.fileExists == false) {
    return res.status(404).send('File not found');
  }

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
          res.send('File updated');
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
 * /{id}:
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
          // delete the file in the file system
          const filePath = 'static/' + user.account + '/' + doc.name;
          if (!fs.existsSync(filePath)) {
            res.status(404).send('File not found');
          } else {
            fs.unlinkSync(filePath);
            res.send('File deleted');
          }

          // delete the document in the database
          doc.destroy();
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

module.exports = router;