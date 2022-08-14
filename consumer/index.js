console.log("Consumer...");

const Kafka = require("node-rdkafka");
const eventType = require("../eventType.js");

// Using the standard API
const consumer = Kafka.KafkaConsumer(
  {
    "group.id": "Kafka", // required for all consumers
    "metadata.broker.list": "localhost:9092", // required
  },
  {}
);

// flowing method where we get messages as soon as they are available
consumer.connect();

consumer
  .on("ready", () => {
    console.log("consumer ready...");
    consumer.subscribe(["test-topic"]); // we need to subscribe to our topic
    consumer.consume(); // this will consume the events
  })
  .on("data", (message) => {
    // console.log(`received message: ${message.value.toString()} from stream`);
    result = eventType.fromBuffer(message.value); // deserializing
    console.log(`received message: ${result.toString()} from stream`);
  });
