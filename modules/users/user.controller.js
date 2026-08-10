const mongoose = require("mongoose");
const UserModel = require("./user.model");
const cloudinary = require("../../config/cloudinary.js");
const streamifier = require("streamifier");
const sendWelcomeEmail = require("../../services/sendWelcomeEmail");
const jwt = require("jsonwebtoken");
const { ACCESS_JWT_SECRET, JWT_SECRET } = require("../../config/config");

const secretKey = ACCESS_JWT_SECRET || JWT_SECRET || "DEFAULT_SECRET_KEY";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false
        },
        secretKey,
        { expiresIn: "7d" }
    );
};

const UserRegister = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required!" });
        }

        const existingUser = await UserModel.findOne({ email, isAdmin: { $ne: true } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email address." });
        }

        let profileUrl = req.body.profile || req.body.profileUrl || "https://res.cloudinary.com/llzw1dmz/image/upload/v1786053620/theblissco_assets/theblissco_official_logo.jpg";
        const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

        if (uploadedFile) {
            try {
                const profile = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "user_profile",
                            public_id: `${Date.now()}`
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );

                    streamifier.createReadStream(uploadedFile.buffer).pipe(stream);
                });

                profileUrl = profile.secure_url;
            } catch (cloudErr) {
                console.warn("Cloudinary upload warning, using default profile:", cloudErr.message);
            }
        }

        const newUser = new UserModel({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: (phone || "").trim(),
            password,
            profile: profileUrl
        });

        const Data = await newUser.save();

        // Send welcome email in background
        sendWelcomeEmail(email, name).catch(err => console.log("Welcome email sending failed:", err.message));

        const token = generateToken(Data);

        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        };

        res.cookie("token", token, cookieOptions);
        res.cookie("user_session", JSON.stringify({
            id: Data._id,
            name: Data.name,
            email: Data.email,
            phone: Data.phone,
            profile: Data.profile,
            isAdmin: false
        }), { ...cookieOptions, httpOnly: false });

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            token,
            Data: {
                id: Data._id,
                name: Data.name,
                email: Data.email,
                phone: Data.phone,
                profile: Data.profile,
                isAdmin: false
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const UserLogin = async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required!" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const isAdminRequest = isAdmin === true || isAdmin === 'true';

        let user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid email or password!" });
        }

        if (isAdminRequest && !user.isAdmin) {
            return res.status(403).json({ success: false, message: "Access denied. Administrator privileges required." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }

        const token = generateToken(user);

        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        };

        res.cookie("token", token, cookieOptions);
        res.cookie("user_session", JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile: user.profile,
            isAdmin: user.isAdmin || false
        }), { ...cookieOptions, httpOnly: false });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            Data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profile: user.profile,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) {
        console.error("UserLogin Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const UpdateAdminCredentials = async (req, res) => {
    try {
        const { email, password } = req.body
        const adminUser = await UserModel.findOne({ isAdmin: true })
        if (!adminUser) {
            return res.status(404).json({ success: false, message: "Admin account not found!" })
        }
        if (email && email !== adminUser.email) {
            const emailInUse = await UserModel.findOne({ email, isAdmin: true })
            if (emailInUse) {
                return res.status(400).json({ success: false, message: "Email is already taken by another admin account!" })
            }
            adminUser.email = email
        }
        if (password) adminUser.password = password
        await adminUser.save()
        res.status(200).json({
            success: true,
            message: "Admin credentials updated successfully!",
            admin: {
                name: adminUser.name,
                email: adminUser.email,
                isAdmin: true,
                profile: adminUser.profile
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const GetAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 }).sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const CreateNewAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required!" })
        }

        const existingUser = await UserModel.findOne({ email, isAdmin: true })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "An admin user already exists with this email address." })
        }

        const newAdmin = new UserModel({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            profile: "https://res.cloudinary.com/llzw1dmz/image/upload/v1786053620/theblissco_assets/theblissco_official_logo.jpg",
            isAdmin: true
        })

        await newAdmin.save()
        res.status(201).json({
            success: true,
            message: "New Administrator created successfully!",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                isAdmin: true,
                profile: newAdmin.profile
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({ success: false, message: "User ID or Email is required for deletion!" });
        }

        const identifier = decodeURIComponent(id).trim();
        let user = null;

        if (identifier.includes('@')) {
            user = await UserModel.findOneAndDelete({ email: identifier.toLowerCase() });
        } else if (mongoose.Types.ObjectId.isValid(identifier)) {
            user = await UserModel.findByIdAndDelete(identifier);
        } else {
            user = await UserModel.findOneAndDelete({ email: identifier.toLowerCase() });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found or already deleted!" });
        }

        res.status(200).json({
            success: true,
            message: "User account deleted successfully!"
        });
    } catch (error) {
        console.error("DeleteUser Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete account."
        });
    }
};

const ChangeUserPassword = async (req, res) => {
    try {
        const { email, id, currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current password and new password are required!" });
        }

        let user;
        if (id) {
            user = await UserModel.findById(id);
        } else if (email) {
            user = await UserModel.findOne({ email: email.toLowerCase().trim() });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found!" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password!" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const CheckSession = async (req, res) => {
    try {
        const sessionCookie = req.cookies.user_session;
        if (!sessionCookie) {
            return res.status(401).json({ success: false, message: "No session found" });
        }
        let sessionData;
        try {
            sessionData = typeof sessionCookie === 'string' ? JSON.parse(sessionCookie) : sessionCookie;
        } catch (e) {
            sessionData = sessionCookie;
        }
        if (!sessionData || !sessionData.id) {
            return res.status(401).json({ success: false, message: "Invalid session" });
        }
        const user = await UserModel.findById(sessionData.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            Data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const UserLogout = async (req, res) => {
    res.clearCookie("token", {
        sameSite: 'none',
        secure: true
    });
    res.clearCookie("user_session", {
        sameSite: 'none',
        secure: true
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

module.exports = { UserRegister, UserLogin, UpdateAdminCredentials, CreateNewAdmin, GetAllUsers, DeleteUser, CheckSession, UserLogout, ChangeUserPassword }