const app = require('express')();
const path = require('path')
const { sql_file, sql_query } = require('./utils/mysql')
const { verifyJWT } = require('./utils/auth')

// dotenv
require('dotenv').config()

app.use(require('body-parser').json())
app.use(require('cookie-parser')())

app.get('/reviewer/:account/docs', verifyJWT, async (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  const { account } = req.params;
  if (!account)
    return res.sendStatus(400);

  sql_file('./sql/reviewer_docs.sql', [req.user.account, account])
    .then(result => {
      if (!result.length)
        return res.status(200).json(result);

      let status_code = result[0].status_code;
      for (let row of result)
        delete row.status_code;

      if (status_code == 200)
        return res.status(200).json(result);
      res.sendStatus(status_code);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})

app.get('/doc/:id', verifyJWT, async (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  let { id } = req.params
  if (!id)
    return res.sendStatus(400);

  id = Number.parseInt(id)
  if (Number.isNaN(id))
    return res.sendStatus(400)

  sql_file('./sql/get_doc.sql', [req.user.account, id])
    .then(result => {
      if (!result.length)
        return res.sendStatus(404);
      let status_code = result[0].status_code
      if (status_code == 403)
        return res.sendStatus(403)
      delete result[0].status_code
      res.status(200);
      return res.json(result[0]);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})

app.post('/submit/:id', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  let { id } = req.params;
  if (!id || !req.body || !req.body.reviewer || !req.body.message)
    return res.sendStatus(400);

  id = Number.parseInt(id)
  if (Number.isNaN(id))
    return res.sendStatus(400)

  sql_file('./sql/post_submit.sql', [req.user.account, id, req.body.reviewer, req.body.message])
    .then(result => {
      let status_code = result[0].status_code
      switch (status_code) {
        case 4041:
          res.statusMessage = 'Document Not Found'
          return res.status(404).send(res.statusMessage)
        case 4042:
          res.statusMessage = 'Reviewer Not Found'
          return res.status(404).send(res.statusMessage)
        case 4091:
          res.statusMessage = 'Status Conflict'
          return res.status(409).send(res.statusMessage)
        case 4092:
          res.statusMessage = 'Permission Conflict'
          return res.status(409).send(res.statusMessage)
        default:
          return res.sendStatus(status_code);
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})

app.delete('/submit/:id', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  let { id } = req.params;
  if (!id)
    return res.sendStatus(400);

  id = Number.parseInt(id)
  if (Number.isNaN(id))
    return res.sendStatus(400)

  sql_file('./sql/del_submit.sql', [req.user.account, id])
    .then(result => {
      let status_code = result[0].status_code
      res.sendStatus(status_code);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})

app.post('/review/:id', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  let { id } = req.params
  if (!req.body || !id)
    return res.sendStatus(400);

  id = Number.parseInt(id)
  if (Number.isNaN(id))
    return res.sendStatus(400)

  let status = req.body.status
  let message = req.body.message
  if ((status != 2 && status != 3) || (status == 2 && !message) || (status == 3 && message))
    return res.sendStatus(400);

  let result_handler = result => {
    let status_code = result[0].status_code;
    switch (status_code) {
      case 4091:
        res.statusMessage = 'Not For Review Yet'
        return res.status(409).send(res.statusMessage)
      case 4092:
        res.statusMessage = 'Already Been Reviewed'
        return res.status(409).send(res.statusMessage)
      default:
        return res.sendStatus(status_code);
    }
  };

  if (status == 2) {
    sql_file('./sql/reject.sql', [req.user.account, id, message])
      .then(result_handler)
      .catch(err => {
        console.log(err);
        res.sendStatus(500)
      })
  } else {
    sql_file('./sql/approve.sql', [req.user.account, id])
      .then(result_handler)
      .catch(err => {
        console.log(err);
        res.sendStatus(500)
      })
  }
})

app.get('/logs', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);

  let { document, type } = req.query;

  if (!document) {
    document = null;
  } else {
    document = Number.parseInt(document);
    if (Number.isNaN(document))
      return res.sendStatus(400);
  }

  if (!type) {
    type = null;
  } else {
    type = Number.parseInt(type);
    if (Number.isNaN(type))
      return res.sendStatus(400);
  }

  sql_file('./sql/logs.sql', [req.user.account, document, type])
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})


module.exports = app