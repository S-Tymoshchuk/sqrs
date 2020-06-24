const express = require("express");
const {
  Kafka
} = require("kafkajs");

const app = express();
const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({
  groupId: "test-group"
});
const mongoose = require('mongoose');
const helper = require('./db-customers');
const routes = require("./routes");


async function run() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "test-topic",
    fromBeginning: true
  });
  await consumer.run({
    eachMessage: async ({
      topic,
      partition,
      message
    }) => {
      const obj = JSON.parse(message.value);

      helper(obj)

      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });

  app.use(routes)

  mongoose.connect(
    "mongodb://localhost:27017/usersConsumer", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err) {
      if (err) return console.log(err);
      app.listen(3003, function () {
        console.log("Сервер ожидает подключения...");
      });
    }
  );

}
run();