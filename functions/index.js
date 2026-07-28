const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});

setGlobalOptions({maxInstances: 10});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendContactForm = onRequest(
    {secrets: ["GMAIL_USER", "GMAIL_PASS"]},
    (req, res) => {
      cors(req, res, async () => {
        if (req.method !== "POST") {
          return res.status(405).send("Nem engedélyezett módszer!");
        }

        const {name, email, message} = req.body;

        if (!name || !email || !message) {
          return res.status(400).send("Töltse ki az összes mezőt!");
        }

        const mailOptions = {
          from: `"King Stone Design" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          subject: `Új üzenet: ${name}`,
          text: `Új üzenet a weboldalról:\n\n` +
                `Név: ${name}\nEmail: ${email}\nÜzenet:\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #2c2c2c; 
                        padding: 20px; line-height: 1.6; max-width: 600px; 
                        margin: 0 auto; border: 1px solid #b8aa6f; 
                        border-radius: 6px; background-color: #ffffff;">
              <h2 style="color: #b8aa6f; font-family: Arial, sans-serif; 
                         text-transform: uppercase; letter-spacing: 1px; 
                         margin-top: 0; border-bottom: 2px solid #b8aa6f; 
                         padding-bottom: 10px; font-size: 1.2rem;">
                Új webes megkeresés
              </h2>
              
              <p style="margin: 15px 0 5px 0;">
                <strong style="color: #555555;">Név:</strong> ${name}
              </p>
              
              <p style="margin: 5px 0 15px 0;">
                <strong style="color: #555555;">E-mail:</strong> 
                <a href="mailto:${email}" style="color: #b8aa6f; 
                   text-decoration: none;">${email}</a>
              </p>
              
              <div style="margin-top: 20px; padding: 15px; 
                          background-color: #f9f9f9; 
                          border-left: 4px solid #b8aa6f; 
                          border-radius: 4px;">
                <p style="margin: 0 0 5px 0; font-size: 0.85rem; 
                          color: #888888; text-transform: uppercase; 
                          letter-spacing: 1px;">Üzenet:</p>
                <p style="margin: 0; color: #2c2c2c; 
                          white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="margin-top: 25px; font-size: 0.75rem; 
                        color: #aaaaaa; text-align: center; 
                        border-top: 1px solid #eeeeee; padding-top: 10px;">
                kingstonedesign.hu automatikus értesítés
              </p>
            </div>
          `,
          replyTo: email,
        };

        try {
          await transporter.sendMail(mailOptions);
          logger.info("Email sikeresen elküldve!");
          return res.status(200).json({
            success: true,
            message: "Email sent!",
          });
        } catch (error) {
          logger.error("Hiba az email küldésekor:", error);
          return res.status(500).json({
            success: false,
            error: error.toString(),
          });
        }
      });
    },
);
