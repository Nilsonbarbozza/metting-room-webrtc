const socket = io("https://192.168.1.9:3000");
const peer = new Peer(undefined, {
    host: "192.168.1.9",
    port: 3000,
    path: "/peerjs",
    secure: true
});

const videoGrid = document.getElementById("video-container");
const meuVideo = document.getElementById("meuVideo");
const outroVideo = document.getElementById("outroVideo");

// Obtém a câmera e o microfone do usuário
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        addVideoStream(meuVideo, stream);

        peer.on("call", call => {
            call.answer(stream);
            call.on("stream", userVideoStream => {
                addVideoStream(outroVideo, userVideoStream);
            });
        });

        socket.on("user-connected", userId => {
            connectToNewUser(userId, stream);
        });
    })
    .catch(error => {
        console.error("Erro ao acessar a câmera/microfone:", error);
    });

// Função para adicionar o stream de vídeo ao HTML
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
}

// Conectar-se a um novo usuário quando ele entrar
function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    call.on("stream", userVideoStream => {
        addVideoStream(outroVideo, userVideoStream);
    });
}

// Quando o PeerJS gera um ID, juntamos à sala
peer.on("open", id => {
    socket.emit("join-room", "sala1", id);
});
