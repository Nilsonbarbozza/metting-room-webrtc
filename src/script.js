document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById("meu-video");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("⚠️ API getUserMedia não suportada pelo navegador.");
        return;
    }

    try {
        console.log("🔄 Tentando acessar a câmera e o microfone...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        console.log("✅ Câmera e microfone acessados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao acessar a câmera/microfone:", error);

        if (error.name === "NotAllowedError") {
            alert("⚠️ Permissões negadas! Ative a câmera e o microfone nas configurações do navegador.");
        } else if (error.name === "NotFoundError") {
            alert("⚠️ Nenhuma câmera ou microfone encontrado.");
        } else {
            alert("⚠️ Erro desconhecido ao acessar câmera/microfone.");
        }
    }
});

