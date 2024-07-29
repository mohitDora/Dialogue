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
const io = socketIo(server,{
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  },
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(router);

sub.subscribe("chat");
sub.on("message", async (channel, message) => {
  if (channel === "chat") {
    io.emit("message", JSON.parse(message));
    await produceMessage(message);
  }
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("message", async (newMessage) => {
    pub.publish("chat", JSON.stringify(newMessage));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

startMessageConsumer();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
