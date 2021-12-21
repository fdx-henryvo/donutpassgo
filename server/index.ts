import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const data = require("./models/seed.json");
const app = express();
const port = 8000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // options
});

app.use(cors());

/*
 * Endpoints
 */

app.get("/", (req, res) => res.status(200).json({ message: 'Connected!' }));

app.get("/teams", (req, res) => {
    const teams = data.teams;

    res.status(200).json({teams});
});
app.get("/teams/:teamId", (req, res) => {
    const id = parseInt(req.params.teamId);
    const team = data.teams.find((t) => t.id === id);

    res.status(200).json({ team });
});

app.get("/teams/:teamId/members", (req, res) => {
  const id = parseInt(req.params.teamId);
  const members = data.teamMembers.filter((member) => member.teamId === id);

  res.status(200).json({ members });
});

app.get("/teamMembers/:memberId", (req, res) => {});
app.put("/teamMembers/:memberId", (req, res) => {
    res.send("Got a PUT request at /teamMembers");
}); // only send through the updated donutCount

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
