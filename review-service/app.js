const app = require('express')();
const path = require('path')
const { sql_file, sql_query } = require('./utils')
const { verifyJWT } = require('./auth')

app.use(require('body-parser').json())
app.use(require('cookie-parser')())

app.get('/reviewer/:account/docs', verifyJWT, async (req, res) => {
  if (!req.user)
    return res.sendStatus(401);

  sql_query('select id, status, message from documents where reviewer = ?', [req.user.account], result => {
    if (!result)
      return res.sendStatus(500);
    res.status(200);
    res.json(result);
  })
})

app.get('/doc/:id', verifyJWT, async (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  const { id } = req.params
  if (!id)
    return res.sendStatus(400);
  sql_file('./sql/get_doc.sql', [req.user.account, id], result => {
    if (!result)
      return res.sendStatus(500);
    if (!result.length)
      return res.sendStatus(404);
    let status_code = result[0].status_code
    if (status_code == 403)
      return res.sendStatus(403)
    delete result[0].status_code
    res.status(200);
    return res.json(result[0]);
  })
})

app.post('/doc/:id/reviewer', verifyJWT, (req, res) => {
  if (!req.user || !req.body || !req.body.reviewer)
    return res.sendStatus(401);
  const { id } = req.params;
  if (!id)
    return res.sendStatus(400);
  sql_file('./sql/post_reviewer.sql', [req.user.account, id, req.body.reviewer], result => {
    if (!result)
      return res.sendStatus(500);

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
})

app.delete('/doc/:id/reviewer', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  sql_file('./sql/del_reviewer.sql', [req.user.account, id], result => {
    if (!result)
      return res.sendStatus(500);
    let status_code = result[0].status_code
    return res.sendStatus(status_code);
  })
})

app.post('/review/:id', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
  const { id } = req.params
  if (!req.body || !id)
    return res.sendStatus(400);
  let status = req.body.status
  let message = req.body.message
  if ((status != 2 && status != 3) || (status == 2 && !message) || (status == 3 && message))
    return res.sendStatus(400);

  let result_handler = result => {
    if (!result)
      return res.sendStatus(500);
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
    sql_file('./sql/reject.sql', [req.user.account, id, message], result_handler)
  } else {
    sql_file('./sql/approve.sql', [req.user.account, id], result_handler)
  }
})

app.get('/logs', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);

  let { document, user, type } = req.params;
  document = document ? document : null;
  user = user ? user : null;
  type = type ? type : null;

  sql_file('./sql/logs.sql', [req.user.account, document, user, type], result => {
    if (!result)
      return res.sendStatus(500);
    res.json(result)
  })
})


module.exports = app