const nodemailer = require("nodemailer")
const { EMAIL, PASS } = require("./config")

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Server Ready");
    }
});

module.exports = transporter