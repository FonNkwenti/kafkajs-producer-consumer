console.log("Producer...");
const eventType = require("../eventType.js");

// const { Kafka } = require("node-rdkafka");
// console.log(Kafka.features);

const Kafka = require("node-rdkafka");
// console.log(Kafka.features);

const stream = Kafka.Producer.createWriteStream(
  // The Producer constructor takes a configuration object of which the 'metadata.broker.list is the only mandatory option. This is where we pass the list of brokers and their exposed port numbers.
  {
    "metadata.broker.list": "localhost:9092",
  },
  {},
  { topic: "test-topic" }
);

getRandomAnimal = () => {
  const kind = ["CAT", "DOG"];
  return kind[Math.floor(Math.random() * kind.length)];
};

getRandomNoise = (animal) => {
  if (animal === "CAT") {
    const noise = ["purr", "meow"];
    return noise[Math.floor(Math.random() * noise.length)];
  } else if (animal === "DOG") {
    const noise = ["bark", "woof"];
    return noise[Math.floor(Math.random() * noise.length)];
  }
};

const queueMessage = () => {
  const kind = getRandomAnimal();
  const noise = getRandomNoise(kind);
  const event = { kind, noise };
  const result = stream.write(eventType.toBuffer(event)); // Serializing we will use he AVSC buffer to write the streams to the queue
  //const result = stream.write(Buffer.from("data")); // nodejs buffer class is used to handle raw binary data. Each buffer corresponds to some raw memory allocated outside V8. By default it is encoded in utf-8 but  other encodings are supported.
  //   console.log(result); // returns a boolean. if the stream is successful, it will return true.

  if (result) {
    console.log("we are writing to the stream...");
  } else {
    console.log("we cannot stream right now. Too many messages in queue"); // the returned values of the stream.write only tell us if the stream's queue is full. It does not tell us if the message got to Kafkta.
  }
};

// to know if something went wrong with the stream
stream.on("error", (err) => {
  console.error("Error in writing to our Kafka stream!");
  console.error(err);
});

// setting an interval to write messages to the stream every 3 seconds. this will simulate a system writting to the stream
setInterval(() => {
  queueMessage();
}, 3000);
