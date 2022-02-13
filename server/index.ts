import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import mysql from "mysql2";
import cors from "cors";
import { ActiveDirectoryService } from "./ActiveDirectoryService";
import Jimp from "jimp";
import dotenv from "dotenv";

dotenv.config();

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

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTtl: 2628000 }); // 1 month TTL

const verifyCache = (req, res, next) => {
  try {
    const { id } = req.params;
    if (cache.has(id)) {
      const base64Image = cache.get(id);

      res.writeHead(200, {
        "Content-Type": Jimp.MIME_PNG,
        "Content-Length": base64Image.length,
      });
      return res.end(base64Image);
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

const connection = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

// connection.connect(function (err) {
//   if (err) {
//     console.error("Database connection failed: " + err.stack);
//     return;
//   }

//   console.log("Connected to database.");
// });

// connection.end();

app.use(cors());

/*
 * Endpoints
 */

app.get("/", (req, res) => res.status(200).json({ message: "Connected!" }));

app.get("/:id/photo", verifyCache, async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await adService.getUserPhoto(id);

    console.log("PHOTO?", photo);

    const image = await Jimp.read(photo);
    await image
      .resize(150, 150)
      .pixelate(3.5)
      .brightness(-0.2)
      .color([
        { apply: "green", params: [0] },
        { apply: "red", params: [10] },
      ]);

    await image.contrast(0.5);

    const base64Image = await image.getBufferAsync(Jimp.MIME_PNG);

    cache.set(id, base64Image);
    console.log("Storing base64Image to cache for ", id);

    res.writeHead(200, {
      "Content-Type": Jimp.MIME_PNG,
      "Content-Length": base64Image.length,
    });
    res.end(base64Image);
  } catch {
    console.error("no image, send dummy instead");

    const base64 =
      "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";
    const base64Image = Buffer.from(base64, "base64");

    cache.set(id, base64Image);

    res.writeHead(200, {
      "Content-Type": Jimp.MIME_PNG,
      "Content-Length": base64Image.length,
    });
    res.end(base64Image);
  }
});

app.get("/teams", (req, res) => {

  const sql = `SELECT * FROM team`;
  connection.query(sql, function (err, data) {
    if (err) throw err;
    res.status(200).json({
      teams: data
    });
  });
});
app.get("/teams/:teamId", (req, res) => {
  const id = parseInt(req.params.teamId);
  connection.query(
    "SELECT * FROM `team` WHERE `id` = ?",
    [id],
    function (err, data) {
      console.log(data);

      if (err) throw err;
      res.status(200).json({
        team: data[0],
      });
    }
  );
});

app.get("/teams/:teamId/members", (req, res) => {
  const id = parseInt(req.params.teamId);
  // const members = data.teamMembers.filter((member) => member.teamId === id);

  connection.query(
    "SELECT * FROM `team_member` WHERE `teamId` = ?",
    [id],
    function (err, data) {
      console.log(data);

      if (err) throw err;
      res.status(200).json({
        members: data,
      });
    }
  );
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
  console.log(Array.from(io.sockets.sockets.keys()).length);

  socket.on("join-room", (room) => {
    console.log(socket.id + " joining " + room);

    // emit whether donut is disabled to THAT socket
    // const isDonutButtonDisabled =
    // io.to(socket.id).emit()
    socket.join(room);
  });

  socket.on("trigger-alarm", (room) => {
    console.log("trigger-alarm" + room);
    io.to(room).emit("alarm", true);
  });

  socket.on("stop-alarm", (room) => {
    io.to(room).emit("alarm", false);
  });

  socket.on("play-music", (room) => {
    console.log("play da music")
    io.to(room).emit("play-music", true);
  });

  socket.on("update-member", (member, room) => {
    const { id, donutCount } = member;

    if (id && donutCount >= 0) {
      connection.query(
        "UPDATE team_member SET `donutCount` = ? WHERE `id` = ?",
        [donutCount, id],
        function (err, data) {
          if (err) throw err;
        }
      );
    }

    // emit new member lits
    io.to(room).emit("update-member", member);
  });

  socket.on("disable-donut-button", (room) => {
    console.log("disable", room);
    // update room ID and isDisabled

    io.to(room).emit("disable-donut-button");
  });

  socket.on("enable-donut-button", (room) => {
    console.log("enable", room);
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
