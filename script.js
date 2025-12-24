const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

/**
 * Certificado - Retorna null pois o QZ aceita conexões não autenticadas
 */
qz.security.setCertificatePromise(() => Promise.resolve(null));
qz.security.setSignaturePromise(() => Promise.resolve(null));

/**
 * CONECTAR usando WSS (obrigatório para páginas HTTPS)
 */
connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Conectando ao QZ Tray...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: true, // OBRIGATÓRIO: true para WSS
      port: {
        secure: [8181], // Porta WSS
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
    statusEl.innerText = "❌ Erro: " + err.message;
    console.error("Erro de conexão:", err);

    // Instrução clara para o usuário
    mostrarInstrucoesCertificado();
  }
});

/**
 * Mostrar instruções para aceitar certificado
 */
function mostrarInstrucoesCertificado() {
  const popup = document.createElement("div");
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 500px;
    text-align: left;
  `;

  popup.innerHTML = `
    <h2 style="color: #e74c3c; margin-top: 0;">⚠️ Certificado SSL Necessário</h2>
    <p><strong>Para conectar ao QZ Tray, você precisa aceitar o certificado SSL:</strong></p>
    <ol style="line-height: 1.8;">
      <li>Abra uma <strong>NOVA aba</strong> no navegador</li>
      <li>Cole este endereço: <code style="background: #f0f0f0; padding: 5px;">https://10.0.0.99:8181</code></li>
      <li>Clique em <strong>"Avançado"</strong></li>
      <li>Clique em <strong>"Prosseguir para 10.0.0.99 (não seguro)"</strong></li>
      <li>Você verá a página About do QZ Tray</li>
      <li><strong>Volte aqui</strong> e clique em "Conectar" novamente</li>
    </ol>
    <div style="margin-top: 20px;">
      <button onclick="window.open('https://10.0.0.99:8181', '_blank')" 
              style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
        🔓 Abrir QZ Tray (Nova Aba)
      </button>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Fechar
      </button>
    </div>
  `;

  document.body.appendChild(popup);
}

/**
 * IMPRIMIR
 */
printBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Status: Procurando impressora Argox...";

    const printerName = await qz.printers.find("Argox");

    if (!printerName) {
      const allPrinters = await qz.printers.find();
      alert(
        "❌ Impressora Argox não encontrada.\n\n📌 Impressoras disponíveis:\n" +
          allPrinters.join("\n")
      );
      return;
    }

    console.log("✅ Impressora encontrada:", printerName);
    statusEl.innerText = `Status: Imprimindo em ${printerName}...`;

    const config = qz.configs.create(printerName, {
      encoding: "UTF-8",
      forceRaw: true,
    });

    const zplData = [
      {
        type: "raw",
        format: "command",
        flavor: "plain",
        data: "^XA^PW760^LL120^FO20,30^A0N,28^FDTENIS NIKE^FS^FO20,65^A0N,22^FD123456^FS^XZ",
      },
    ];

    await qz.print(config, zplData);
    statusEl.innerText = "✅ Status: Etiqueta enviada com sucesso!";
  } catch (err) {
    statusEl.innerText = "❌ Erro ao imprimir: " + err.message;
    console.error("Erro detalhado:", err);
  }
});

/**
 * DESCONECTAR
 */
window.addEventListener("beforeunload", async () => {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
});
