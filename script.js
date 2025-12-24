const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

// Sem certificado para testes
qz.security.setCertificatePromise(() => Promise.resolve(null));
qz.security.setSignaturePromise(() => Promise.resolve(null));

connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando ao QZ Tray...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: false, // ← MUDOU: false = sem SSL
      port: {
        insecure: [8181], // ← MUDOU: porta 8182
      },
      retries: 3,
      delay: 1,
    });

    const version = await qz.api.getVersion();
    statusEl.innerText = `Status: Conectado ao QZ Tray ${version} ✓`;
    printBtn.disabled = false;

    const printers = await qz.printers.find();
    console.log("Impressoras disponíveis:", printers);
  } catch (err) {
    statusEl.innerText = "Erro: " + err.message;
    console.error("Erro de conexão:", err);
  }
});

printBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Procurando impressora Argox...";

    const printerName = await qz.printers.find("Argox");

    if (!printerName) {
      const allPrinters = await qz.printers.find();
      alert(
        "Impressora Argox não encontrada.\n\nImpressoras disponíveis:\n" +
          allPrinters.join("\n")
      );
      return;
    }

    console.log("Impressora encontrada:", printerName);
    statusEl.innerText = `Status: Imprimindo em ${printerName}...`;

    const config = qz.configs.create(printerName, {
      encoding: "UTF-8",
      scaleContent: false,
      rasterize: false,
      forceRaw: true,
    });

    const zplData = [
      {
        type: "raw",
        format: "command",
        flavor: "plain",
        data: "^XA^PW760^LL120^LH0,0^CF0,28^FO20,30^FDTENIS NIKE^FS^FO20,65^FD123456^FS^XZ",
      },
    ];

    await qz.print(config, zplData);
    statusEl.innerText = "Status: Etiqueta enviada com sucesso ✓";
  } catch (err) {
    statusEl.innerText = "Erro ao imprimir: " + err.message;
    console.error("Erro detalhado:", err);
  }
});

window.addEventListener("beforeunload", async () => {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
});
