require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { pub, sub } = require("./redis");
const cors = require("cors");
const router = require("./router/routes");
const {
  produceMessage,
  startMessageConsumer,
} = require("./kafka-services/_kafka");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://dialogue-nine.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
    preflightContinue: false,
  },
});

const corsOptions = {
  origin: ["http://localhost:3000", "https://dialogue-nine.vercel.app"],
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

// Ensure Redis client is connected before subscribing
sub.on("connect", () => {
  console.log("Connected to Redis, subscribing to 'chat' channel");
  sub.subscribe("chat");
});

sub.on("error", (err) => {
  console.error("Redis subscription error:", err);
});

sub.on("message", async (channel, message) => {
  if (channel === "chat") {
    try {
      const parsedMessage = JSON.parse(message);
      io.emit("message", parsedMessage); // Broadcast to all connected clients
      console.log("Message emitted to clients:", parsedMessage); // Debugging line
      await produceMessage(message); // Produce the message to Kafka
    } catch (err) {
      console.error("Error handling message:", err);
    }
  }
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("message", async (newMessage) => {
    try {
      const messageString = JSON.stringify(newMessage);
      pub.publish("chat", messageString); // Publish to Redis
      console.log("Message published to Redis:", newMessage); // Debugging line
    } catch (err) {
      console.error("Error publishing message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

startMessageConsumer();

const PORT = 4000 || "https://dialogue-server.vercel.app/";
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
