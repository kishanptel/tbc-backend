const express = require("express")
const upload = require("../../middlewares/multer.middleware")
const { UserRegister, UserLogin, UpdateAdminCredentials, CreateNewAdmin, GetAllUsers, DeleteUser, CheckSession, UserLogout, ChangeUserPassword } = require("./user.controller")
const route = express.Router()

route.post("/register", upload.any(), UserRegister)
route.post("/login", UserLogin)
route.post("/logout", UserLogout)
route.post("/change-password", ChangeUserPassword)
route.put("/change-password", ChangeUserPassword)
route.get("/me", CheckSession)
route.put("/admin/update", UpdateAdminCredentials)
route.post("/admin/create", CreateNewAdmin)
route.get("/all", GetAllUsers)
route.delete("/delete/:id", DeleteUser)
route.delete("/:id", DeleteUser)
route.post("/delete/:id", DeleteUser)

module.exports = route