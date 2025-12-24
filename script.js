const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

// Configuração de segurança simples
qz.security.setCertificatePromise(() => Promise.resolve(null));
qz.security.setSignaturePromise(() => Promise.resolve(null));

// CONECTAR
connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: true, // WSS obrigatório para HTTPS
      port: {
        secure: [8181],
      },
    });

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
      encoding: "UTF-8",
      forceRaw: true,
    });

    const zpl = [
      {
        type: "raw",
        format: "command",
        flavor: "plain",
        data: "^XA^PW760^LL120^FO20,30^A0N,28^FDTENIS NIKE^FS^FO20,65^A0N,22^FD123456^FS^XZ",
      },
    ];

    await qz.print(config, zpl);
    statusEl.innerText = "✅ Etiqueta enviada!";
  } catch (err) {
    statusEl.innerText = `❌ Erro: ${err.message}`;
    console.error(err);
  }
});

// Desconectar ao fechar
window.addEventListener("beforeunload", async () => {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
});
