const express = require('express')
const routes = express.Router();
const User = require('./db-customers')


routes.get('/users/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({
    _id: id
  })
  res.send(user)
})
module.exports = routes