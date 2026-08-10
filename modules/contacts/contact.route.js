const express = require("express")
const { SubmitContactInquiry, GetAllContacts } = require("./contact.controller")
const route = express.Router()

route.post("/inquiry", SubmitContactInquiry)
route.post("/create", SubmitContactInquiry)
route.post("/", SubmitContactInquiry)
route.get("/all", GetAllContacts)
route.get("/", GetAllContacts)

module.exports = route
