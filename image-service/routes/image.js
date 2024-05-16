var express = require('express');
var router = express.Router();

const fs = require('fs');

const authenticator = require('../handler/authenticator');
const imageSaver = require('../handler/imageSaver');
const fileManager = require('../handler/fileManager');

/**
 * @swagger
 * /ids:
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
router.get('/ids', authenticator.getUserInfo, (req, res) => {
  console.log(req.email);
  const files = fileManager.listFiles(req.email)
  res.send(files);
});

/**
 * @swagger
 * /{id}:
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
router.get('/:id', authenticator.getUserInfo, (req, res) => {
  const filePath = 'static/' + req.email + '/' + req.params.id;
  console.log(filePath);
  if(!fs.existsSync(filePath)) {
    res.status(404).send('File not found');
  }
  else {
    res.download(filePath);
  }
});

/**
 * @swagger
 * /:
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
router.post('/', authenticator.getUserInfo, imageSaver.single('file'), (req, res) => {
  const mimetype = fileManager.getMimeType(req.file.path);
  const validMimetype = ['image/png', 'image/jpeg'];

  if(!validMimetype.includes(mimetype)) {
    res.status(415).send('Unsupported media type');
  } else {
    res.status(200).send({id: req.file.filename});
  }
});

module.exports = router;
