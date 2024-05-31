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
 * /role:
 *   post:
 *     summary: Create a new role for the doc.
 * 
 *     description: This route is used to create a new role for the doc.
 * 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              doc-id:
 *                type: integer
 *              account:
 *                type: string
 *                description: account of the user to be assigned the role
 *              role:
 *                type: integer
 *                description: 0 - viewer, 1 - editor, 2 - reviewer, 3 - owner
 * 
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
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found or Document not found
 */
router.post('/', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByAccount(req.body.account);
    const userOwner = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.body['doc-id']);
    if (!user) return res.status(404).send('User not found');
    if (!userOwner) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');

    // TODO: admin can also grant the role to others

    // only the owner can assign the role
    if (userOwner.account !== document.creator) {
      return res.status(401).send('Unauthorized');
    }

    // reviewer only can be granted in the review phase
    if (req.body.role == 2) {
      return res.status(401).send('Unauthorized');
    }

    // check if the role is already exist
    const role = await dbHelper.findRole(req.body['doc-id'], user.account);
    if (role) return res.status(409).send('Role already exists');

    // create a new role in the database
    await dbHelper.createRole(req.body['doc-id'], user.account, req.body.role);

    return res.send("Role created");
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }
});


/**
 * @swagger
 * /role:
 *   delete:
 *     summary: Delete a role for the doc.
 * 
 *     description: This route is used to delete a role for the doc.
 * 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doc-id:
 *                 type: integer
 *               account:
 *                 type: string
 *                 description: account of the user to be assigned the role
 * 
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
 *       '401':
 *         description: Unauthorized
 * 
 *       '404':
 *         description: User not found or Document not found
 */
router.delete('/', authenticator.getInfoFromAuthService, async (req, res) => {
  try {
    // check authorization
    const user = await dbHelper.findUserByAccount(req.body.account);
    const userOwner = await dbHelper.findUserByEmail(req.email);
    const document = await dbHelper.findDocumentById(req.body['doc-id']);
    if (!user) return res.status(404).send('User not found');
    if (!userOwner) return res.status(404).send('User not found');
    if (!document) return res.status(404).send('Document not found');


    // TODO: admin can also revoke the role from others

    // reviewer only can revoke in the review phase
    if (req.body.role == 2) {
      return res.status(401).send('Unauthorized');
    }

    // only the owner or admin can delete the role
    if (userOwner.account !== document.creator) {
      return res.status(401).send('Unauthorized');
    }

    // check if the role is already exist
    const role = await dbHelper.findRole(req.body['doc-id'], user.account);
    if (!role) return res.status(409).send('Role not found');

    // delete the role in the database
    await dbHelper.deleteRole(req.body['doc-id'], user.account);

    return res.send("Role deleted");
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Internal Server Error!' });
  }
});

module.exports = router;