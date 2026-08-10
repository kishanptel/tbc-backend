const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.Mixed },
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    price: { type: mongoose.Schema.Types.Mixed, default: 0 },
    qty: { type: Number, default: 1 },
    quantity: { type: Number, default: 1 },
    img: { type: String, default: "/logo.png" },
    customDetails: { type: String, default: "" },
    selectedItems: { type: Array, default: [] },
    wrapping: { type: String, default: "" },
    ribbon: { type: String, default: "" }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.Mixed, default: null },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    isUserDeleted: { type: Boolean, default: false }
}, { versionKey: false, timestamps: true });

const OrderModel = mongoose.model("orders", OrderSchema);

module.exports = OrderModel;
