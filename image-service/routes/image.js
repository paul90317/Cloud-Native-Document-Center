var express = require('express');
var router = express.Router();

const fs = require('fs');

// handlers modules
const authenticator = require('../handler/authenticator');
const imageSaver = require('../handler/imageSaver');
const fileManager = require('../handler/fileManager');

// database modules
const db = require('../models');

/**
 * @swagger
 * /image/ids:
 *   get:
 *     summary: Get ids of all images uploaded by the user.
 *     description: Get ids of all images uploaded by the user.
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: string
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
router.get('/ids', authenticator.getInfoFromAuthService, (req, res) => {
  const db = require('../models');

  // TODO: get all image ids of the user from the database

  // db.sequelize.sync().then(() => {
  //   db.images.findAll().then(image => {
  //     console.log("All image:", image);
  //     res.send(image);
  //   });
  // });

  const files = fileManager.listFiles(req.email)
  res.send(files);
});

/**
 * @swagger
 * /image/{id}:
 *   get:
 *     summary: This route is used to download the image that the user has uploaded.
 *     description: Will download the image with the given id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the item to get
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
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
router.get('/:id', authenticator.getInfoFromAuthService, (req, res) => {
  // find the corresponding document of the image

  // check if the user is the document owner

  // return the image file
  const filePath = 'static/' + req.email + '/' + req.params.id;
  if (!fs.existsSync(filePath)) {
    res.status(404).send('File not found');
  }
  else {
    res.sendFile(filePath, { root: './' });
  }
});

/**
 * @swagger
 * /image/:
 *   post:
 *     summary: This route is used to upload an image.
 * 
 *     description: Will upload the image file.
 * 
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               doc-id:
 *                 type: integer
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
 *                 id:
 *                   type: string
 *         description: A successful response
 * 
 *       '404':
 *         description: User not found
 * 
 *       '415':
 *         description: Unsupported media type
 */
router.post('/', authenticator.getInfoFromAuthService, imageSaver.single('file'), (req, res) => {
  const mimetype = fileManager.getMimeType(req.file.path);
  const validMimetype = ['image/png', 'image/jpeg'];

  // check if the uploaded file is an image

  // check if the user is the document owner

  // check if the document exists
  db.sequelize.sync().then(() => {
    db.documents.findOne({
      where: {
        id: req.body['doc-id']
      }
    }).then(document => {
      if (document === null) {
        res.status(404).send('Document not found');
        return;
      }

      // save the metadata to the database
      db.sequelize.sync().then(() => {
        db.images.create({
          id: req.file.filename,
          document: req.body['doc-id'],
        })
      });

      if (!validMimetype.includes(mimetype)) {
        res.status(415).send('Unsupported media type');
      } else {
        res.status(200).send({ id: req.file.filename });
      }
    });
  });
});

module.exports = router;
