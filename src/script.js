document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById("meu-video");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        console.log("camera acessada!");
    } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
    }
});
