const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userScheme = new Schema({
  name: String,
  age: Number,
  event: String
}, {
  versionKey: false,
});
const User = mongoose.model("User", userScheme);

async function helper(obj) {
  if (obj.type === 'ADD_USER') {
    const newUser = {
      event: obj.event,
      name: obj.name,
      age: obj.age
    }
    const user = await new User(newUser);
    user.save()
  }
}

module.exports = helper;
module.exports = User