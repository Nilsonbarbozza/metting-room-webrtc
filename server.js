const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.static("src")); // Ajustado para sua pasta

const options = {
    key: fs.readFileSync("ssl/key.pem"),
    cert: fs.readFileSync("ssl/cert.pem")
};

https.createServer(options, app).listen(3000, () => {
    console.log("Servidor HTTPS rodando em https://localhost:3000");
});
