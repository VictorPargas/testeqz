const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

/**
 * CONFIGURAÇÃO DE SEGURANÇA
 * Para WSS, você precisa aceitar o certificado auto-assinado do QZ Tray
 */
qz.security.setCertificatePromise(() => {
  return fetch("https://10.0.0.99:8181/download/certificate")
    .then((response) => response.text())
    .catch((err) => {
      console.warn("Falha ao buscar certificado, usando null:", err);
      return null;
    });
});

qz.security.setSignaturePromise(() => Promise.resolve(null));

/**
 * CONECTAR AO QZ TRAY no IP 10.0.0.99
 */
connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando ao QZ Tray...";

    await qz.websocket.connect({
      host: "10.0.0.99", // IP onde o QZ Tray está rodando
      usingSecure: true, // Usar protocolo seguro (WSS)
      port: {
        secure: [8181], // Porta segura
      },
      retries: 3, // Tentar 3 vezes
      delay: 1, // Aguardar 1 segundo entre tentativas
    });

    const version = await qz.api.getVersion();
    statusEl.innerText = `Status: Conectado ao QZ Tray ${version} ✓`;
    printBtn.disabled = false;

    // Listar impressoras disponíveis
    const printers = await qz.printers.find();
    console.log("Impressoras disponíveis:", printers);
  } catch (err) {
    statusEl.innerText = "Erro: Não foi possível conectar ao QZ Tray";
    console.error("Erro de conexão:", err);

    // Instruções para o usuário
    alert(
      "Não foi possível conectar ao QZ Tray.\n\n" +
        "Passos para resolver:\n" +
        "1. Acesse: https://10.0.0.99:8181/\n" +
        "2. Aceite o certificado de segurança no navegador\n" +
        "3. Tente conectar novamente"
    );
  }
});

/**
 * IMPRIMIR ETIQUETA ZPL NA ARGOX
 */
printBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Procurando impressora Argox...";

    // Buscar impressora Argox
    const printerName = await qz.printers.find("Argox");

    if (!printerName) {
      statusEl.innerText = "Erro: Impressora Argox não encontrada";
      const allPrinters = await qz.printers.find();
      console.error("Impressoras disponíveis:", allPrinters);
      alert(
        "Impressora Argox não encontrada.\nImpressoras disponíveis:\n" +
          allPrinters.join("\n")
      );
      return;
    }

    console.log("Impressora encontrada:", printerName);
    statusEl.innerText = `Status: Imprimindo em ${printerName}...`;

    // Configurar impressora
    const config = qz.configs.create(printerName, {
      encoding: "UTF-8",
      scaleContent: false,
      rasterize: false,
      forceRaw: true,
    });

    // Comando ZPL para etiqueta
    const zplData = [
      {
        type: "raw",
        format: "command",
        flavor: "plain",
        data: [
          "^XA",
          "^PW760",
          "^LL120",
          "^LH0,0",
          "^CF0,28",
          "^FO20,30",
          "^FDTENIS NIKE^FS",
          "^FO20,65",
          "^FD123456^FS",
          "^XZ",
        ].join("\n"),
      },
    ];

    await qz.print(config, zplData);
    statusEl.innerText = "Status: Etiqueta enviada com sucesso ✓";
  } catch (err) {
    statusEl.innerText = "Erro ao imprimir: " + err.message;
    console.error("Erro detalhado:", err);
  }
});

/**
 * DESCONECTAR ao sair
 */
window.addEventListener("beforeunload", async () => {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
});
