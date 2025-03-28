const socket = io("https://192.168.1.6:3000");
const peer = new Peer(undefined, {
    host: "192.168.1.6",
    port: 3000,
    path: "/peerjs",
    secure: true
});

// Obtém os elementos de vídeo da interface
const videoGrid = document.getElementById("video-container");
const meuVideo = document.getElementById("meuVideo");
const outroVideo = document.getElementById("outroVideo");

const peers = {}; // Armazena conexões ativas

// Obtém a câmera e o microfone do usuário
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        // Exibe o próprio vídeo na interface
        addVideoStream(meuVideo, stream, "meuVideo");

        peer.on("call", call => {
            call.answer(stream);
            call.on("stream", userVideoStream => {
                addUserVideo(call.peer, userVideoStream);
            });
        });

        socket.on("user-connected", userId => {
            console.log(`Usuário conectado: ${userId}`);
            connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", userId => {
            console.log(`Usuário desconectado: ${userId}`);
            if (peers[userId]) {
                peers[userId].close();
                removeVideo(userId);
                delete peers[userId];
            }
        });
    })
    .catch(error => {
        console.error("Erro ao acessar a câmera/microfone:", error);
    });

// Quando o PeerJS gera um ID, o usuário entra na sala
peer.on("open", id => {
    socket.emit("join-room", "sala1", id);
});

// Conectar-se a um novo usuário quando ele entra
function connectToNewUser(userId, stream) {
    if (!userId || peers[userId]) return;

    const call = peer.call(userId, stream);
    call.on("stream", userVideoStream => {
        addUserVideo(userId, userVideoStream);
    });

    call.on("close", () => {
        removeVideo(userId);
    });

    call.on("error", err => {
        console.error(`Erro na conexão com ${userId}:`, err);
    });

    peers[userId] = call;
}

// Adiciona os vídeos dos usuários na interface corretamente
function addUserVideo(userId, stream) {
    let videoElement;

    // Define onde o vídeo será exibido
    if (!document.getElementById("outroVideo").srcObject) {
        videoElement = outroVideo;
    } else if (!document.getElementById("video-container").srcObject) {
        videoElement = videoGrid;
    } else {
        // Se todos os espaços estão ocupados, cria um novo vídeo dinâmico
        videoElement = document.createElement("video");
        videoElement.id = userId;
        videoGrid.appendChild(videoElement);
    }

    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
}

// Adiciona o próprio vídeo na interface
function addVideoStream(video, stream, id) {
    video.srcObject = stream;
    video.id = id;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
}

// Remove o vídeo da interface quando o usuário sai
function removeVideo(userId) {
    const video = document.getElementById(userId);
    if (video) {
        video.remove();
    }
}
