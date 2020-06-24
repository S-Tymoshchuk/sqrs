const {
  Kafka
} = require("kafkajs");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userScheme = new Schema({
  name: String,
  age: Number,
}, {
  versionKey: false,
});
const User = mongoose.model("User", userScheme);

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

app.post("/user", urlencodedParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const newuser = {
    type: "ADD_USER",
    event: 'CREATE_USER',
    name: req.body.name,
    age: req.body.age,
  };

  const user = await new User(newuser);
  await user.save();

  const kafkaObj = await JSON.stringify(newuser);
  await producer.send({
    topic: "test-topic",
    messages: [{
      value: kafkaObj,
    }, ],
  });
  res.send(user);
});

async function run() {
  await producer.connect();
  mongoose.connect(
    "mongodb://localhost:27017/usersdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err) {
      if (err) return console.log(err);
      app.listen(3002, function () {
        console.log("Сервер ожидает подключения...");
      });
    }
  );
}
run();