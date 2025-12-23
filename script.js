const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

/**
 * CONFIGURAÇÃO DE SEGURANÇA
 * (para teste apenas – NÃO usar assim em produção)
 */
qz.security.setCertificatePromise(() =>
  Promise.resolve(`-----BEGIN CERTIFICATE-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsFakeCertOnlyForTest
-----END CERTIFICATE-----`)
);

qz.security.setSignaturePromise((data) => Promise.resolve("assinatura_fake"));

/**
 * CONECTAR AO QZ TRAY
 */
connectBtn.addEventListener("click", async () => {
  try {
    await qz.websocket.connect({
      host: "localhost",
      port: 8181,
      protocol: "wss",
    });

    statusEl.innerText = "Status: Conectado ao QZ Tray";
    printBtn.disabled = false;
  } catch (err) {
    statusEl.innerText = "Erro: QZ Tray não encontrado";
    console.error(err);
  }
});

/**
 * IMPRIMIR ETIQUETA (ZPL)
 */
printBtn.addEventListener("click", async () => {
  try {
    const printer = await qz.printers.getDefault();
    const config = qz.configs.create(printer);

    const data = [
      "^XA",
      "^FO50,50^A0N,40,40^FDTeste QZ Tray^FS",
      "^FO50,100^FD123456^FS",
      "^XZ",
    ];

    await qz.print(config, data);
    statusEl.innerText = "Etiqueta enviada para impressão";
  } catch (err) {
    statusEl.innerText = "Erro ao imprimir";
    console.error(err);
  }
});
