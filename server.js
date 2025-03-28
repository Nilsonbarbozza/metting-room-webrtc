const https = require("https");
const fs = require("fs");
const express = require("express");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();

// Configurações do SSL
const options = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
};

// Servindo arquivos da pasta "src"
app.use(express.static("src"));

// Criando servidor HTTPS
const server = https.createServer(options, app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Configuração do PeerJS
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

// Evento de conexão do Socket.io
io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log(`Usuário ${userId} entrou na sala ${roomId}`);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
      console.log(`Usuário ${userId} saiu da sala ${roomId}`);
    });
  });
});

// Inicia o servidor na rede local
const HOST = "192.168.1.6"; // Seu IP local
const PORT = 3000;

server.listen(PORT, HOST, () => {
  console.log(`🔒 Servidor HTTPS rodando em https://${HOST}:${PORT}/sala.html`);
});
