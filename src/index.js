const mongoose = require("mongoose");
const DataBaseConnection = require("../config/database");
const app = require("./app");
const UserModel = require("../modules/users/user.model");

let isConnected = false;
let adminSeeded = false;

const handler = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await DataBaseConnection();
            isConnected = true;
        }

        if (!adminSeeded) {
            try {
                const adminExist = await UserModel.findOne({ isAdmin: true });

                if (!adminExist) {
                    await UserModel.create({
                        name: "BlissCo Admin",
                        email: "admin@theblissco.in",
                        password: "admin123",
                        isAdmin: true,
                        profile: "https://res.cloudinary.com/llzw1dmz/image/upload/v1786053620/theblissco_assets/theblissco_official_logo.jpg"
                    });

                    console.log("BlissCo Admin account seeded.");
                }
                adminSeeded = true;
            } catch (seedErr) {
                console.warn("Admin seed check skipped:", seedErr.message);
            }
        }

        if (req && res) {
            return app(req, res);
        }
    } catch (err) {
        console.error("Vercel Serverless Handler Error:", err);
        if (res && !res.headersSent) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
};

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    handler().then(() => {
        app.listen(PORT, () => {
            console.log(`theblissco Backend server listening on http://localhost:${PORT}`);
        });
    });
}

module.exports = handler;