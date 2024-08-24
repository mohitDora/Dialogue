const { Kafka, Partitioners, logLevel } = require("kafkajs");
const query = require("../utils/query");

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  connectionTimeout: 10000, // Increased connection timeout to 10 seconds
  requestTimeout: 30000, // Optional: Increased request timeout to 30 seconds
  logLevel: logLevel.ERROR,
});

let producer = null;

async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  await _producer.connect();
  producer = _producer;
  return producer;
}

async function produceMessage(message) {
  const producer = await createProducer();
  try {
    await producer.send({
      messages: [{ key: `message-${Date.now()}`, value: message }],
      topic: "MESSAGES",
    });
    return true;
  } catch (error) {
    console.error("Error producing message:", error);
    return false; // Handle error, optionally implement retry logic
  }
}

async function startMessageConsumer() {
  console.log("Consumer is running..");
  const consumer = kafka.consumer({ groupId: "default" });

  try {
    await consumer.connect();
    console.log("Connected to Kafka broker");

    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: false });
    console.log("Subscribed to topic MESSAGES");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const newMessage = JSON.parse(message.value.toString());
        console.log(`New Message Received:`, newMessage);

        const { sender_id, receiver_id, message: msg } = newMessage;
        const data = { sender_id, receiver_id, message: msg };

        try {
          const result = await query("chats", data, { type: "INSERT" });
          console.log("Message inserted into database:", result);
        } catch (error) {
          console.error("Error inserting message into database:", error.message);

          consumer.pause([{ topic: "MESSAGES" }]);
          setTimeout(() => {
            console.log("Resuming consumer...");
            consumer.resume([{ topic: "MESSAGES" }]);
          }, 60000); // Resume after 60 seconds
        }
      },
    });
  } catch (error) {
    console.error("Error in consumer:", error);
    process.exit(1); // Exit process on critical error
  }
}

async function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  if (producer) await producer.disconnect();
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = { kafka, produceMessage, startMessageConsumer };
