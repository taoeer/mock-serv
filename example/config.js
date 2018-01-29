module.exports = {
  'GET /number': 52,
  'GET /string': 'hello',
  'GET /json': {
    msg: 'hello'
  },
  'POST /post': {
    msg: 'hello'
  },
  'POST /func': (req, res) => {
    res.end(req.body.name);
  }
}
