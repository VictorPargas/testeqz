const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

/**
 * CONFIGURAÇÃO DE SEGURANÇA
 * Para produção, você precisará gerar certificados reais
 * Veja: https://qz.io/wiki/using-digital-certificates
 */
qz.security.setCertificatePromise(() => Promise.resolve(null));
qz.security.setSignaturePromise(() => Promise.resolve(null));

/**
 * CONECTAR AO QZ TRAY
 */
connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando...";

    await qz.websocket.connect({
      usingSecure: false, // Use false para conexões locais sem SSL
      port: {
        insecure: [8181, 8182, 8283, 8384, 8485],
      },
    });

    statusEl.innerText = "Status: Conectado ao QZ Tray ✓";
    printBtn.disabled = false;

    // Listar impressoras disponíveis (útil para debug)
    const printers = await qz.printers.find();
    console.log("Impressoras disponíveis:", printers);
  } catch (err) {
    statusEl.innerText = "Erro: QZ Tray não encontrado";
    console.error("Erro de conexão:", err);
  }
});

/**
 * IMPRIMIR ETIQUETA ZPL NA ARGOX
 */
printBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Procurando impressora Argox...";

    // Buscar impressora Argox
    const printerName = await qz.printers.find("Argox OS-214 plus series PPLA");

    if (!printerName) {
      statusEl.innerText = "Erro: Impressora Argox não encontrada";
      console.error("Impressoras disponíveis:", await qz.printers.find());
      return;
    }

    console.log("Impressora encontrada:", printerName);
    statusEl.innerText = `Status: Imprimindo em ${printerName}...`;

    // Configurar impressora
    const config = qz.configs.create(printerName, {
      encoding: "UTF-8",
      scaleContent: false,
      rasterize: false,
      forceRaw: true, // Importante para comandos RAW/ZPL
    });

    // Comando ZPL para etiqueta
    const zplData = [
      {
        type: "raw",
        format: "command",
        flavor: "plain",
        data: [
          "^XA", // Início do comando ZPL
          "^PW760", // Largura da etiqueta (760 dots)
          "^LL120", // Altura da etiqueta (120 dots)
          "^LH0,0", // Home position
          "^CF0,28", // Define fonte padrão
          "^FO20,30", // Campo na posição X=20, Y=30
          "^FDTENIS NIKE^FS", // Texto: TENIS NIKE
          "^FO20,65", // Campo na posição X=20, Y=65
          "^FD123456^FS", // Texto: 123456
          "^XZ", // Fim do comando ZPL
        ].join("\n"),
      },
    ];

    // Enviar para impressão
    await qz.print(config, zplData);

    statusEl.innerText = "Status: Etiqueta enviada com sucesso ✓";
  } catch (err) {
    statusEl.innerText = "Erro ao imprimir: " + err.message;
    console.error("Erro detalhado:", err);
  }
});

/**
 * DESCONECTAR (opcional)
 */
window.addEventListener("beforeunload", async () => {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
});
