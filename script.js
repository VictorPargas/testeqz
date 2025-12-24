const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

printBtn.disabled = true;

// 🔥 HTTPS sem signing
qz.security.setCertificatePromise(() => Promise.resolve());
qz.security.setSignaturePromise(() => Promise.resolve());

connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Conectando...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: true,
      port: { secure: [8181] },
    });

    await new Promise((r) => setTimeout(r, 400));

    statusEl.innerText = "✅ Conectado ao QZ Tray";
    printBtn.disabled = false;
  } catch (e) {
    statusEl.innerText = "❌ Falha ao conectar";
    console.error(e);
  }
});

printBtn.addEventListener("click", async () => {
  try {
    const printer = await qz.printers.find("Argox");

    const config = qz.configs.create(printer, { forceRaw: true });

    // EPL (Argox)
    const data = [
      "N",
      'A50,30,0,3,1,1,N,"TENIS NIKE"',
      'A50,70,0,2,1,1,N,"123456"',
      "P1",
    ];

    await qz.print(config, data);
    statusEl.innerText = "✅ Impresso!";
  } catch (e) {
    statusEl.innerText = "❌ Erro ao imprimir";
    console.error(e);
  }
});
