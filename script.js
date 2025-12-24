const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

printBtn.disabled = true;

// 🔥 NÃO retorne null
qz.security.setCertificatePromise(() => Promise.resolve());
qz.security.setSignaturePromise(() => Promise.resolve());

// CONECTAR
connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: false,
      port: { insecure: [8182] },
    });

    await new Promise((r) => setTimeout(r, 300));

    const version = await qz.api.getVersion();
    statusEl.innerText = `✅ Conectado ao QZ Tray ${version}`;
    printBtn.disabled = false;
  } catch (err) {
    statusEl.innerText = `❌ Erro: ${err.message}`;
    console.error(err);
  }
});

// IMPRIMIR
printBtn.addEventListener("click", async () => {
  try {
    const printerName = await qz.printers.find("Argox");

    if (!printerName) {
      statusEl.innerText = "❌ Argox não encontrada";
      return;
    }

    statusEl.innerText = `Imprimindo em ${printerName}...`;

    const config = qz.configs.create(printerName, {
      forceRaw: true,
    });

    // ✅ EPL FUNCIONAL PARA ARGOX
    const data = [
      "N",
      'A50,30,0,3,1,1,N,"TENIS NIKE"',
      'A50,70,0,2,1,1,N,"123456"',
      "P1",
    ];

    await qz.print(config, data);
    statusEl.innerText = "✅ Etiqueta impressa!";
  } catch (err) {
    statusEl.innerText = `❌ Erro: ${err.message}`;
    console.error(err);
  }
});

// DESCONECTAR
window.addEventListener("beforeunload", () => {
  if (qz.websocket.isActive()) {
    qz.websocket.disconnect();
  }
});
