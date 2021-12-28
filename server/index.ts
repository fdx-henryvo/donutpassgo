import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { ActiveDirectoryService } from "./ActiveDirectoryService";

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
const adService = new ActiveDirectoryService();

app.use(cors());

/*
 * Endpoints
 */

app.get("/", (req, res) => res.status(200).json({ message: 'Connected!' }));

app.get("/:id/photo", async (req,res) => {
    const {id} = req.params;
    const photo = await adService.getUserPhoto(id)
    res.status(200).send(photo);
})

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

  socket.on("join-room", (room) => {
      console.log(socket.id + " joining " + room);

    //   console.log(io.sockets.adapter.rooms[room]?.length);

      socket.join(room)
  });

  socket.on("trigger-alarm", (room) => {
      console.log("trigger-alarm" + room);
      io.to(room).emit("alarm", true);
  });

  socket.on("stop-alarm", (room) => {
      io.to(room).emit("alarm", false);
  });

  socket.on("update-member", (member, room) => {
      console.log(member?.id);
      console.log(room);

      // UPDATE THE DB MEMBERS
      // ...

      // emit new member lits
      io.to(room).emit("update-member", member);
  });

  socket.on("disconnect", (reason) => {
    // ...
    console.log("disconnect");
    // io.disconnectSockets();

  });
});

httpServer.listen(port, () => {
  console.log(`App backend running on port ${port}!`);
});
