const express = require("express")
const { CreateOrder, GetAllOrders, UpdateOrderStatus, GetUserOrders } = require("./order.controller")
const route = express.Router()

route.post("/create", CreateOrder)
route.post("/", CreateOrder)
route.get("/user", GetUserOrders)
route.get("/all", GetAllOrders)
route.get("/", GetAllOrders)
route.put("/status/:id", UpdateOrderStatus)
route.put("/:id/status", UpdateOrderStatus)

module.exports = route
