const Content = require('models').Content

exports.add = (req, res) => {
  Content.create({
    message: req.body.message,
    publishAt: req.body.publishAt
  }).then((content) => {
      res.send(req.body.message)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
}

exports.getAll = (req, res) => {
  Content.findAll().then((contents) => {
    res.send(contents)
  }).catch((err) => {
    res.status(500).send(err)
  })
}
