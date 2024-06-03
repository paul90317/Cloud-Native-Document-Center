var express = require('express');
var router = express.Router();

const fs = require('fs');

// handlers modules
const authenticator = require('../handler/authenticator');
const imageSaver = require('../handler/imageSaver');
const publicImageSaver = require('../handler/publicImageSaver');
const fileManager = require('../handler/fileManager');

/**
 * @swagger
 * /image/public:
 *   post:
 *     summary: This route is used to upload an image publicly.
 * 
 *     description: Will upload the image file publicly.
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
 *                 url:
 *                   type: string
 *         description: A successful response
 * 
 *       '404':
 *         description: User not found
 * 
 *       '415':
 *         description: Unsupported media type
 */
router.post('/public', publicImageSaver.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const filePath = 'static/public/' + req.filename;
    const urlPath = 'image/public/' + req.filename;

    // Determine the base URL based on the request origin
    const host = req.headers.host;
    const isLocalHost = host.includes('localhost') || host.includes('127.0.0.1');
    // const baseUrl = isLocalHost ? 'http://localhost:8082' : 'http://image-service:8082';
    const baseUrl = 'http://localhost:8082';

    const fileUrl = `${baseUrl}/${urlPath}`;
    const mimetype = fileManager.getMimeType(filePath);
    const validMimetype = ['image/png', 'image/jpeg'];

    if (!validMimetype.includes(mimetype)) {
      return res.status(415).send('Unsupported media type');
    }

    console.log(req.file);
    res.status(200).send({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


/**
 * @swagger
 * /image/public/{id}:
 *   get:
 *     summary: This route is used to get the image that the user has uploaded publicly.
 *     description: Will get the image with the given id.
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
router.get('/public/:id', (req, res) => {
  try {
    // return the image file
    const filePath = 'static/public/' + req.params.id;
    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
    }
    else {
      res.sendFile(filePath, { root: './' });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
