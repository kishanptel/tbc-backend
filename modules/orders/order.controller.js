const OrderModel = require("./order.model");

const CreateOrder = async (req, res) => {
    try {
        const { userId, userEmail, userName, items, totalPrice } = req.body;
        if (!userEmail || !userName || !items || !items.length || !totalPrice) {
            return res.status(400).json({ message: "Invalid order details." });
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
        }));

        const newOrder = new OrderModel({
            userId: userId || null,
            userEmail: userEmail.toLowerCase().trim(),
            userName,
            items: normalizedItems,
            totalPrice,
            isUserDeleted: false
        });

        const Data = await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            Data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const GetAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 });
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

const UpdateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const GetUserOrders = async (req, res) => {
    try {
        const { email, userId } = req.query;
        if (!email && !userId) {
            return res.status(400).json({ success: false, message: "Email or userId parameter is required." });
        }

        const queryConditions = [
            { isUserDeleted: { $ne: true } }
        ];

        if (userId) {
            queryConditions.push({
                $or: [
                    { userId: userId },
                    { userEmail: String(email || '').trim().toLowerCase() }
                ]
            });
        } else if (email) {
            const cleanEmail = String(email).trim();
            const safeRegex = new RegExp('^' + cleanEmail.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
            queryConditions.push({
                $or: [
                    { userEmail: cleanEmail.toLowerCase() },
                    { userEmail: safeRegex }
                ]
            });
        }

        const orders = await OrderModel.find({
            $and: queryConditions
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders: orders || []
        });
    } catch (error) {
        console.error("GetUserOrders Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { CreateOrder, GetAllOrders, UpdateOrderStatus, GetUserOrders };
