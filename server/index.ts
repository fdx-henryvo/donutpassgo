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

/*
 * Sockets
 */

io.on("connection", (socket: Socket) => {
  // ...
  console.log("New websocket connection");
});

httpServer.listen(port, () => {
  console.log(`App backend running on port ${port}!`);
});