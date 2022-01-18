import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { ActiveDirectoryService } from "./ActiveDirectoryService";
import Jimp from "jimp";

// const data = require("./models/seed.json");
const {data} = require("./models/seed.ts");
// import { data as DATAx } from "./models/seed";
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

    try {
      const photo = await adService.getUserPhoto(id)
  
      console.log("PHOTO?", photo)
  
      const image = await Jimp.read(photo);
      await image
        .resize(150, 150)
        .pixelate(3.5)
        .brightness(-0.2)
        .color([
          { apply: "green", params: [0] },
          { apply: "red", params: [10] },
        ]);
  
      await image.contrast(.5);
  
      const base64Image = await image.getBufferAsync(Jimp.MIME_PNG);
  
      res.writeHead(200, {
        "Content-Type": Jimp.MIME_PNG,
        "Content-Length": base64Image.length,
      });
      res.end(base64Image); 

    } catch {
      console.error("no image, send dummy instead")
      // const image = await Jimp.read(
      //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTACNKPDZDFNPcBEAX2LC0Bp3tOSDXmR-o8G196S5VVC91rR5YzsAEJEOjkLScdBMGT6p4&usqp=CAU"
      // );
      // await image
      //   .resize(150, 150)
      //   .pixelate(3.5)
      //   // .brightness(-0.2)
      //   .color([
      //     { apply: "green", params: [0] },
      //     { apply: "red", params: [10] },
      //   ]);

      // await image.contrast(0.5);

      // const base64 = image.getBase64Async(Jimp.MIME_PNG);
      const base64 = "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";
      // console.log(base64);

      // const base64Image = await base64.getBufferAsync(Jimp.MIME_PNG);
      const base64Image = Buffer.from(base64, "base64");
      // console.log(base64Image.toString("hex").match(/../g).join(" "));

      res.writeHead(200, {
        "Content-Type": Jimp.MIME_PNG,
        "Content-Length": base64Image.length,
      });
      res.end(base64Image); 


    }
})

app.get("/teams", (req, res) => {
    console.log(data.teams)
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

  socket.on("disable-donut-button", (room) => {
    console.log('disable', room)
    io.to(room).emit("disable-donut-button");
  });
  
  socket.on("enable-donut-button", (room) => {
    console.log('enable', room)
    io.to(room).emit("enable-donut-button");
  });
  // disable-donut-button

  socket.on("disconnect", (reason) => {
    // ...
    console.log("disconnect");
    // io.disconnectSockets();

  });
});

httpServer.listen(port, () => {
  console.log(`App backend running on port ${port}!`);
});
