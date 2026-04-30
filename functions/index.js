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
  const mailOptions = {
    from: "matias.tolvanen13@gmail.com",
    to: "kristerw4@gmail.com",
    subject: "Uusi tilaus vastaanotettu",
    text:
      "Uusi tilaus:\n\n" +
      JSON.stringify(order, null, 2),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Sähköposti lähetetty!");
  } catch (error) {
    console.error("Sähköpostin lähetys epäonnistui:", error);
  }
});