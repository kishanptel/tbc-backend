const jwt = require("jsonwebtoken");
const { ACCESS_JWT_SECRET, JWT_SECRET } = require("../config/config");
const UserModel = require("../modules/users/user.model");

const secretKey = ACCESS_JWT_SECRET || JWT_SECRET || "DEFAULT_SECRET_KEY";

// Verify JWT token from HTTP-only cookie or Authorization header
const verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. Authentication token missing." });
        }

        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        // Fetch fresh user data from DB
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User account no longer exists." });
        }
        req.userProfile = user;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
    }
};

// Verify Admin privileges
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Access forbidden. Admin rights required." });
    }
};

module.exports = { verifyToken, verifyAdmin };
