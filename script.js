const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

const QZ_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIECzCCAvOgAwIBAgIGAZtQlHl4MA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG
EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS
UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx
HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg
RGVtbyBDZXJ0MB4XDTI1MTIyMzEzMzc0NloXDTQ1MTIyMzEzMzc0NlowgaIxCzAJ
BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD
VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs
IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog
VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDM
MKIYytgSPo+r8tr9Z7Bb0+boILyHlucZnjbANkB2LyLYF6DaDclkmFWcX6lpK0W7
HavoryNA7SXywwojkf+bq05aNYlhdUak54ogqDnzY6R2Ej9QwACmVYZiwNGcjLcr
qs0J5kgX/8CdLNPZod89s+WMh3u4RxMC2iMqxjjw5E3c9P27z+WTpzh+GYxWCt+W
QrMTWBc1dEykmJ6BObzT0hSLFAtE52fDuFaM1KQLWmKjBWKpDKQ77G9ZpI+/XaC/
c7tBLTdB7p2pJ2gp3pHosqVO/eVsHqVRQhyKcFLvHwLpoFd4SubZyzbsryVrAaHH
Nub9MwZlomT9Y6yRt8ApAgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD
VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBRJCdOLxEoVvaZYXGEAHFQ66yuA+TANBgkq
hkiG9w0BAQsFAAOCAQEAbAwjRuqWkRWv/ScS/LVb++fw0kklvjBoBsAz6gifbQcP
XPdnjoCW8vx6Y0/YqokRsaR6R7PnHI3vlN3/vSSxjO1pkrIYW0F0Ekv/ABueOqi9
QA0aoD8UoqQOe3ws3YPKxpZb3wSS/f85buvkS4zVgFNWHrNa3VlSmqy0QYhQPck3
svyuK6OrWPKTz3KPm8STtBvEBzz8aph49X12Zs9wspBD0sS/oPumX4Q1wZWksBKY
dnCWCZ9jIX1JI1oHInnQjxWgdOXvZy5BtljNHpLxbIxH5b/rrpQBdgS2Kp9FBul5
XIPur0WxzJbxNy0ZRTuU1tPngEcWI2PjLR46BNCqYQ==
-----END CERTIFICATE-----`;

printBtn.disabled = true;

// 🔑 certificado direto no código
qz.security.setCertificatePromise(() => Promise.resolve(QZ_CERTIFICATE));

// 🔕 assinatura neutra
qz.security.setSignaturePromise(() => Promise.resolve(""));

connectBtn.addEventListener("click", async () => {
  try {
    statusEl.innerText = "Conectando ao QZ Tray...";

    await qz.websocket.connect({
      host: "10.0.0.99",
      usingSecure: true,
      port: { secure: [8181] },
    });

    await new Promise((r) => setTimeout(r, 400));

    const version = await qz.api.getVersion();
    statusEl.innerText = `✅ Conectado ao QZ Tray ${version}`;
    printBtn.disabled = false;
  } catch (e) {
    statusEl.innerText = "❌ Falha ao conectar";
    console.error(e);
  }
});

printBtn.addEventListener("click", async () => {
  try {
    const printer = await qz.printers.find("Argox");

    const config = qz.configs.create(printer, {
      forceRaw: true,
    });

    // EPL (Argox)
    const data = [
      "N",
      'A50,30,0,3,1,1,N,"TENIS NIKE"',
      'A50,70,0,2,1,1,N,"123456"',
      "P1",
    ];

    await qz.print(config, data);
    statusEl.innerText = "✅ Etiqueta impressa!";
  } catch (e) {
    statusEl.innerText = "❌ Erro ao imprimir";
    console.error(e);
  }
});
