const express = require('express')
const routes = express.Router();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({
  extended: false
})

routes.post('/user', urlencodedParser, async (req, res) => {
  await req.producer.send({
    topic: 'issue-certificate',
    messages: [{
      name: req.body.name,
      age: req.body.age
    }]
  })

})

module.exports = {
  routes
}