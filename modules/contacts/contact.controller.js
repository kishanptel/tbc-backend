const ContactModel = require("./contact.model")

const SubmitContactInquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email and message are required!" })
        }

        const newInquiry = new ContactModel({
            name,
            email,
            subject,
            message
        })

        const Data = await newInquiry.save()

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully...",
            Data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const GetAllContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            contacts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { SubmitContactInquiry, GetAllContacts }
