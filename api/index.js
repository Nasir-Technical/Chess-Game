const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("index");
});

if (!global.io) {
  global.io = io;

  io.on("connection", function (uniquesocket) {
    if (!players.white) {
      players.white = uniquesocket.id;
      uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
      players.black = uniquesocket.id;
      uniquesocket.emit("playerRole", "b");
    } else {
      uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("move", (Move) => {
      const result = chess.move(Move);
      if (result) {
        io.emit("move", Move);
        io.emit("boardState", chess.fen());
      }
    });
  });
}

module.exports = server;