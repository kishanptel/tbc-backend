const OrderModel = require("./order.model")

const CreateOrder = async (req, res) => {
    try {
        const { userEmail, userName, items, totalPrice } = req.body
        if (!userEmail || !userName || !items || !items.length || !totalPrice) {
            return res.status(400).json({ message: "Invalid order details." })
        }

        const normalizedItems = items.map((item, index) => ({
            id: item.id || index + 1,
            name: item.name || item.title || "Custom Bouquet",
            title: item.title || item.name || "Custom Bouquet",
            price: item.price || 0,
            qty: item.qty || item.quantity || 1,
            quantity: item.quantity || item.qty || 1,
            img: item.img || "/logo.png",
            customDetails: item.customDetails || "",
            selectedItems: item.selectedItems || [],
            wrapping: item.wrapping || "",
            ribbon: item.ribbon || ""
        }))

        const newOrder = new OrderModel({
            userEmail: userEmail.toLowerCase().trim(),
            userName,
            items: normalizedItems,
            totalPrice
        })

        const Data = await newOrder.save()

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            Data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const GetAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const UpdateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        if (!status) {
            return res.status(400).json({ message: "Status is required." })
        }

        const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true })
        if (!order) {
            return res.status(404).json({ message: "Order not found." })
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const GetUserOrders = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email parameter is required." });
        }
        const orders = await OrderModel.find({ userEmail: email.toLowerCase().trim() }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { CreateOrder, GetAllOrders, UpdateOrderStatus, GetUserOrders }
