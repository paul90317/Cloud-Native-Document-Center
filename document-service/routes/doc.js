var express = require('express');
var router = express.Router();

const fs = require('fs');

// handlers modules
const authenticator = require('../handler/authenticator');
const documentSaver = require('../handler/documentSaver');
const documentUpdator = require('../handler/documentUpdator');

// utils modules
const dbHelper = require('../util/dbHelper');

// database modules
const db = require('../models');

/**
 * @swagger
 * /doc/all:
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
router.get('/all', authenticator.getUserInfo, async (req, res) => {
  try {
    // find the user by email
    const user = await dbHelper.findUserByEmail(req.email);
    if (!user) return res.status(404).send('User not found');

    console.log(user.account);

    // there are 5 roles (admin, editor, owner, viewer, reviewer) can access the document
    const roles = await dbHelper.findRoleByUser(user.account);
    let docs = [];
    for (const role of roles) {
      const doc = await dbHelper.findDocumentById(role.document);
      docs.push(doc);
    }

    // return the docname & id & status of all docs
    res.send(docs.map(doc => {
      return {
        docname: doc.name,
        id: doc.id,
        status: doc.status
      }
    }));
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal Server Error!' });
  }
});


/**
 * @swagger
 * /doc:
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
router.post('/', authenticator.getUserInfo, documentSaver.single('file'), async (req, res) => {
  try {
    // check authorization
    if (!req.isAuthorized) {
      return res.status(401).send('Unauthorized');
    }

    // check if the file is uploaded
    if (req.fileExists) {
      return res.status(409).send('File already exists');
    }

    // create a new doc in the database
    await dbHelper.createDocument(req.body.docname, req.user.account, 0);

    // add the role between the creator and the document
    const doc = await dbHelper.findDocumentByName(req.body.docname);
    await dbHelper.createRole(doc.id, req.user.account, 0);

    return res.send("Document created");
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }
});


/**
 * @swagger
 * /doc/{id}:
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
router.get('/:id', authenticator.getUserInfo, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');

    // there are 5 roles (admin, editor, owner, viewer, reviewer) can access the document
    const role = await dbHelper.findRole(req.params.id, user.account);
    if (!role) {
      return res.status(401).send('Unauthorized');
    }

    // return the document
    const filePath = 'static/' + user.account + '/' + document.name;
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    res.sendFile(filePath, { root: './' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }
});


/**
 * @swagger
 * /doc/{id}:
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
 *               docname:
 *                 type: string
 *                 description: Name of the new file
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
router.put('/:id', authenticator.getUserInfo, documentUpdator.single('newFile'), async (req, res) => {
  try {
    // check authorization
    if (!req.isAuthorized) {
      return res.status(401).send('Unauthorized');
    }

    // check if the file is uploaded
    if (!req.fileExists) {
      return res.status(404).send('File not found');
    }

    // update document in database
    await dbHelper.updateDocumentName(req.params.id, req.body.docname);

    return res.send('File updated');
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }

});


/**
 * @swagger
 * /doc/{id}:
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
router.delete('/:id', authenticator.getUserInfo, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');

    // TODO: admin also can delete the document
    // only the owner can delete the document
    if (user.account !== document.creator) {
      return res.status(401).send('Unauthorized');
    }

    // delete the file in the file system
    const filePath = 'static/' + user.account + '/' + document.name;
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    fs.unlinkSync(filePath);

    // delete the all related roles in the database
    const roles = await dbHelper.findRoleByDocument(req.params.id);
    for (const role of roles) {
      await dbHelper.deleteRole(role.document, role.user);
    }

    // delete the document in the database
    await dbHelper.deleteDocument(req.params.id);
    return res.send('File deleted');
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }
});

module.exports = router;