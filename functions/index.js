const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "matias.tolvanen13@gmail.com",
    pass: "dhqn dryz ywrb narb",
  },
});

exports.sendOrderEmail = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data.data();

  // Funktio kenttien listaamiseen
  const formatObject = (obj, title) => {
    if (!obj || typeof obj !== "object") return "";
    const entries = Object.entries(obj).map(([key, value]) => {
      let displayValue = value;
      if (typeof value === "object") {
        displayValue = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(", ");
      }
      return `<li><strong>${key}:</strong> ${displayValue}</li>`;
    }).join("");
    return `<h2>${title}</h2><ul>${entries}</ul>`;
  };

  const mailOptions = {
    from: "matias.tolvanen13@gmail.com",
    to: "kristerw4@gmail.com",
    subject: "Uusi tilaus vastaanotettu",
    html: `
      <h1>Uusi tilaus vastaanotettu</h1>
      ${formatObject(order.customer, "Tilaajan tiedot")}
      <h2>Tilauksen tuotteet</h2>
      <ul>
        ${(order.items || []).map((item) => `<li>${formatObject(item, "Tuote")}</li>`).join("")}
      </ul>
      ${formatObject({
    total: order.total,
    ...Object.fromEntries(Object.entries(order).filter(([key]) => !["customer", "items"].includes(key))),
  }, "Muut tiedot")}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Sähköposti lähetetty!");
  } catch (error) {
    console.error("Sähköpostin lähetys epäonnistui:", error);
  }
});
