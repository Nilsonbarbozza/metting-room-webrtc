const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servindo arquivos estáticos (ex: sala.html)
app.use(express.static("src"));

io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);
    
    socket.on("join-room", (roomId, userId) => {
        console.log(`Usuário ${userId} entrou na sala ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
