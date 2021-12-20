import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const port = 8000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // options
});

/*
 * Endpoints
 */

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

app.get("/teams", (req, res) => {});
app.get("/teams/:teamId", (req, res) => {});
app.get("/teamMembers/:memberId", (req, res) => {});
app.patch("/teamMembers/:memberId", (req, res) => {}); // only send through the updated donutCount

/*
 * Sockets
 */

io.on("connection", (socket: Socket) => {
  // ...
  console.log("New websocket connection");
});

// io.on()
// io.to("some room").emit("some event");

httpServer.listen(port, () => {
  console.log(`App backend running on port ${port}!`);
});
