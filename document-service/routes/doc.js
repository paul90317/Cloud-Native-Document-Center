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
router.get('/all', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // find the user by email
    const user = await dbHelper.findUserByEmail(req.email);
    if (!user) return res.status(404).send('User not found');

    // admin can access all the documents
    if (user.manager === true) {
      const docs = await dbHelper.findAllDocuments();
      return res.send(docs.map(doc => {
        return {
          docname: doc.name,
          id: doc.id,
          status: doc.status
        }
      }));
    }

    // there are other 4 roles (editor, owner, viewer, reviewer) can access the document
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
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              docname:
 *                type: string
 *                description: Name of the new doc
 *              content:
 *                type: string
 *                description: content of the new doc
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         content:
 *          text/plain:
 *           schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: Name of the new doc
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
router.post('/', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // check if the user is exist
    const user = await dbHelper.findUserByEmail(req.email);
    if (!user) return res.status(404).send('User not found');

    // create a new doc in the database
    const doc = await dbHelper.createDocument(req.body.docname, req.body.content, user.account, 0);

    // add the viewer and editor roles between the creator and the document
    await dbHelper.createRole(doc.id, user.account, 0);
    await dbHelper.createRole(doc.id, user.account, 1);

    return res.send({ id: doc.id });
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
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docname:
 *                   type: string
 *                 content:
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
router.get('/:id', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');

    // there are 5 roles (admin, editor, owner, viewer, reviewer) can access the document
    const role = await dbHelper.findRole(req.params.id, user.account);
    if (!role && user.manager !== true) {
      return res.status(401).send('Unauthorized');
    }

    // return the document
    return res.send({
      'docname': document.name,
      'content': document.content,
      'doc-id': document.id,
      'creator': document.creator,
      'status': document.status
    });
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
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              docname:
 *                type: string
 *                description: New name of the doc
 *              content:
 *                type: string
 *                description: New content of the doc
 * 
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       '200':
 *         description: File updated
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.put('/:id', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    const user = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.params.id);

    // check if the user is exist
    if (!user) return res.status(404).send('User not found');

    // check if the document is exist
    if (!document) return res.status(404).send('Document not found');

    // only the owner can update the document
    if (document.creator !== user.account) {
      return res.status(401).send('Unauthorized');
    }

    // update document in database
    await dbHelper.updateDocument(req.params.id, req.body.content, req.body.docname);

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
 *         description: Document deleted
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.delete('/:id', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');

    // only the owner can delete the document
    if (user.account !== document.creator && user.manager !== true) {
      return res.status(401).send('Unauthorized');
    }

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


/**
 * @swagger
 * /doc/auth/{id}:
 *   get:
 *     summary: This route is used to get all the users who have access to the doc.
 * 
 *     description: Will response the users who have access to the doc with the given id.
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
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   doc-id:
 *                     type: integer
 *                   account:
 *                     type: string
 *                   role:
 *                     type: integer
 *         
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found
 */
router.get('/auth/:id', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');

    console.log("[INFO] user: ", user);

    // only the owner can access the document
    if (document.creator !== user.account && user.manager !== true) {
      return res.status(401).send('Unauthorized');
    }

    // find the roles of the document
    const roles = await dbHelper.findRoleByDocument(req.params.id);
    return res.send(roles.map(role => {
      return {
        'doc-id': role.document,
        'account': role.user,
        'role': role.role
      }
    }));
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }
});

module.exports = router;