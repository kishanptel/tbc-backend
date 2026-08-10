require("dotenv").config()

module.exports = {
    DATABASE_NAME: process.env.DATABASE_NAME,
    MONGOOSE_URI: process.env.MONGOOSE_URI,
    PASS: process.env.PASS,
    EMAIL: process.env.EMAIL,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
    ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}