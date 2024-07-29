const {Kafka,Partitioners,logLevel}=require("kafkajs")
const query=require("../utils/query")

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
      mechanism: 'scram-sha-256',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD
  },
  logLevel: logLevel.ERROR,
});

let producer= null;

async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
  await _producer.connect();
  producer = _producer;
  return producer;
}

async function produceMessage(message) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

async function startMessageConsumer() {
  console.log("Consumer is running..");
  const consumer = kafka.consumer({ groupId: "default" });

  try {
    await consumer.connect();
    console.log("Connected to Kafka broker");

    await consumer.subscribe({ topic: "MESSAGES" });
    console.log("Subscribed to topic MESSAGES");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const newMessage = JSON.parse(message.value.toString());
        console.log(`New Message Received:`, newMessage);

        const { sender_id, receiver_id, message: msg } = newMessage;
        const data = {
          sender_id,
          receiver_id,
          message: msg,
        };

        try {
          // Simulate an async operation (replace with your actual query function)
          const result = await query("chats", data, { type: "INSERT" });
          console.log("Message inserted into database:", result);
        } catch (error) {
          console.error("Error inserting message into database:", error.message);

          // Pause consumer on error and resume after a delay
          consumer.pause([{ topic: "MESSAGES" }]);
          setTimeout(() => {
            console.log("Resuming consumer...");
            consumer.resume([{ topic: "MESSAGES" }]);
          }, 60 * 1000); // Resume after 60 seconds
        }
      },
    });
  } catch (error) {
    console.error("Error in consumer:", error);
    process.exit(1); // Exit process on critical error
  }
}

module.exports={kafka,produceMessage,startMessageConsumer}