import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const data = require("./models/seed.json");
const app = express();
const port = 8000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
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
  console.log("New websocket connection", socket?.id);

//   io.of("/").sockets.size;
//   io.engine.clientsCount;
    console.log(Array.from(io.sockets.sockets.keys()).length)

  socket.on("join-room", ({ id, name }) => {
      console.log(socket.id + " joining " + `${id}-${name}`);

    //   console.log(io.sockets.adapter.rooms[`${id}-${name}`]?.length);

      socket.join(`${id}-${name}`)
  });

  socket.on("trigger-alarm", ({ id, name }) => {
      console.log("trigger-alarm" + `${id}-${name}`);
      io.to(`${id}-${name}`).emit("alarm", true);
  });

  socket.on("stop-alarm", ({ id, name }) => {
      io.to(`${id}-${name}`).emit("alarm", false);
  });

  socket.on("disconnect", (reason) => {
    // ...
    console.log("disconnect");
    // io.disconnectSockets();

  });
});

// io.on()
// io.to("some room").emit("some event");

httpServer.listen(port, () => {
  console.log(`App backend running on port ${port}!`);
});
