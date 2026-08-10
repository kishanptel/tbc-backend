require("dotenv").config();

module.exports = {
    DATABASE_NAME: process.env.DATABASE_NAME || "the_blissco",
    MONGOOSE_URI: process.env.MONGOOSE_URI || "mongodb+srv://patelshruti0728_db_user:LB34FZhQs1Xapimd@cluster0.5nvbnv3.mongodb.net/?appName=Cluster0",
    PASS: process.env.PASS || "gzygyryiljwyazvg",
    EMAIL: process.env.EMAIL || "patelshruti0728@gmail.com",
    JWT_SECRET: process.env.JWT_SECRET || "AWDFDFE",
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || "JSNFKJS",
    ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET || "HDBDFHS",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "llzw1dmz",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "385235447769339",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "CVtn8c99wqH_0V6YrRUfdBsuRAY"
};