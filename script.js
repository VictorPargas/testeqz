const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

printBtn.disabled = true;

// Segurança simples (APENAS para HTTP)
qz.security.setCertificatePromise(() => Promise.resolve(null));
qz.security.setSignaturePromise(() => Promise.resolve(null));

// CONECTAR
connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: false, // ⬅️ HTTP / WS
      port: {
        insecure: [8182],
      },
    });

    // ⬅️ evita race condition do QZ Tray
    await new Promise((r) => setTimeout(r, 300));

    const version = await qz.api.getVersion();
    statusEl.innerText = `✅ Conectado ao QZ Tray ${version}`;
    printBtn.disabled = false;

    const printers = await qz.printers.find();
    console.log("Impressoras:", printers);
  } catch (err) {
    statusEl.innerText = `❌ Erro: ${err.message}`;
    console.error(err);
  }
});

// IMPRIMIR
printBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Procurando impressora Argox...";

    const printerName = await qz.printers.find("Argox OS-214 plus series PPLA");

    if (!printerName) {
      const all = await qz.printers.find();
      statusEl.innerText = "❌ Argox não encontrada";
      console.log("Impressoras disponíveis:", all);
      return;
    }

    statusEl.innerText = `Imprimindo em ${printerName}...`;

    const config = qz.configs.create(printerName, {
      forceRaw: true,
      encoding: "UTF-8",
    });

    const data = [
      {
        type: "raw",
        format: "command",
        data: "^XA^PW760^LL120^FO20,30^A0N,28^FDTENIS NIKE^FS^FO20,65^A0N,22^FD123456^FS^XZ",
      },
    ];

    await qz.print(config, data);
    statusEl.innerText = "✅ Etiqueta enviada!";
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
