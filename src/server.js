import express from "express";
import SocketIO from "socket.io";
import http from "http";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static("public"));

app.get("/", (req, res) => res.render("home.pug"));
app.get("/*", (req, res) => res.redirect("/")); //catchall url,, 이외의 url은 모두 홈으로

const handleListen = () => {
  console.log(`Listening on port http://localhost:${PORT}`);
};

// app.listen(PORT, handleListen); //http만 돌릴때

const httpServer = http.createServer(app); //http서버에 접근
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);

    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

httpServer.listen(PORT, handleListen);
