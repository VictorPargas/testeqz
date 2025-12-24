const statusEl = document.getElementById("status");
const connectBtn = document.getElementById("connectBtn");
const printBtn = document.getElementById("printBtn");

printBtn.disabled = true;

/* =====================================================
   CERTIFICADO PÚBLICO (OK)
===================================================== */
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

/* =====================================================
   PRIVATE KEY (SÓ PARA DEV)
===================================================== */
const QZ_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCfAaJdlLxlGgxJ
WPVcoCK1DQdhk2ksusmDRDgvglqdteFgs2gqmf5527FdiPR5Z9XHwyxa4NdAj1ia
u7OCMJhICgJzm30EqEqPgQyMDOAfbXHneER3yBXx1Z0R2qSz+J9RD+KgaPqi6u6u
QuXTyuUh5wJtYZO0+If6mJSjYH6Vj7e2zSrA67js7UALAqLU7mkIYyOfu9IansNo
Qj3lRmqSwTptvYjbzd+Mt8CrmBMEeekLkVMvZTAuDcRTzD3GfvUc6VqSrpDsJSVV
0x3tglq5MUWNxG4I6cGNhWJlkhyw6S8JRkqymMOD3hMxfNLaBCAPg6KzMUNOMxrS
gRawXLIJAgMBAAECggEAF0gp+gHZRAR4YBUCeDmKW3A48HShJceD0hCfGXXAxu7m
vT4HtpUtybH9WnC/OzeU+db+G6BoZC+ZDa8GLb3nzkSI71yJBbGOmUyQBcGs320r
DHVzsQY/EFXy1bZp/2AcE8Z7rHkymcBEioeJF2XR/xDQLivncMwjPPIycWmjn0pc
spG+HsmA3ApskJLFgAFLc6mPhn4ico9Mkhi9vj4tvJFk2vy971Et359x5U7y7bxv
HasPQs/xWIr6bPp/4+KZPax8jTWPirtVR72NH/SGQDsNtGv9f/n5vjPxaxxZXCJk
UpyJgi1zh+jgQI0TAeqVJxHoo6QvUcjzqMWxeT01sQKBgQDVdbVFu8nah53r8xhw
GF4UWt9R689fum0wi9RCYYXrfEeDXxlJSmc0ic2DOmScxjcn1q5Gh/P45DZ91Mv/
QfwLb6IUg85rDOZWr1u55hSvMCEmE3pYcpDQS6j4owe2hDjr38xKwx/1aasHCyyT
Dpu8ev931tUgrYpQnm5k/IDvPwKBgQC+sdJoQrb0H6WI8TJHk/BioaSZ5DgvxP0z
ozKMdJneGBlsdLi2VfyQvTKMtV3tNTUSrYTnye5iR7KzcwZNtrS3g+9kGvv6wMGH
LbNW3QUkGU03gG70gfrG/rHYcdHiDaRnvLcJCki9T/iQwOcLNoDZxaDhZvSnN4qo
pm5n4w9UtwKBgE96vn4yh9w4dtKt90F1sUH++/vyw4ovTgyvY987lLOz2KTPugiS
DY+AZ+cezOua2lqZEtbsNClOQAPmQfbPSNuxOzZMRYWSjglkzdCQHM+GKjGVOw7H
yaflJAtAGNUasl8RO23y7WlhaO78eCJhZBdv7MNgWIcMVt3hv9UWN6PdAoGAFM03
A5KLfJPbLdYJww8bQNcbKoJfsq5NZI2f3Px3MGf2lgMhhxpYI73PvtOl/FM6h+AP
yG0ZqPTjRHn+rQmKKx6kRYpABHl0YveUQZx4jBiKeMx0zg1DuuNbqR25ZGxSi9Jl
MQJDLwuDNN8mFO4MHjVVuGDPvVHsuTr2fjShnn8CgYAsAM0YdyYBJqLH477isn4s
EhdQEdUkk2+vmuzyjZdTjgtInTpWi0B1BB8o5C7f5zo1djHOW407/RdoW7+7YS4T
9LHADCbx4l7XzjXPP0G3L27KdB2mIczP551Pzv/GAaJRajf3CcYGB02RW0rxRwOr
+vhu4L4AssyQsgd1eziK9Q==
-----END PRIVATE KEY-----
`;

/* =====================================================
   SEGURANÇA QZ (CORRETA)
===================================================== */
qz.security.setCertificatePromise(() => Promise.resolve(QZ_CERTIFICATE));
qz.security.setSignatureAlgorithm("SHA512");
qz.security.setSignaturePromise((toSign) => {
  const sig = new KJUR.crypto.Signature({ alg: "SHA512withRSA" });
  sig.init(QZ_PRIVATE_KEY);
  sig.updateString(toSign);
  return Promise.resolve(sig.sign());
});

/* =====================================================
   CONECTAR
===================================================== */
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
    statusEl.innerText = "❌ Erro ao conectar";
    console.error(e);
  }
});

/* =====================================================
   IMPRIMIR (EPL – ARGOX)
===================================================== */
printBtn.addEventListener("click", async () => {
  try {
    const printer = await qz.printers.find("Argox");

    const config = qz.configs.create(printer, { forceRaw: true });

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
