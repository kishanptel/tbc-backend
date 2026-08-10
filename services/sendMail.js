const { EMAIL } = require("../config/config")
const transporter = require("../config/mail")


async function sendEmail(to, subject, text, html, attachments = []) {
    try {
        const info = await transporter.sendMail({
            from: EMAIL,
            to,
            cc: "",
            bcc: [],
            subject,
            text,
            html,
            attachments
        })

        return true
        // console.log(info)
        // return info.messageId
    } catch (error) {
        console.log("Mail error : ", error.message)
        return false
    }
}

module.exports = sendEmail