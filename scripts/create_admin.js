const mongoose = require("mongoose");
require("dotenv").config();

const UserModel = require("../modules/users/user.model.js");

async function createAdmin() {
  const uri = process.env.MONGOOSE_URI || "mongodb://localhost:27017/theblissco";
  console.log("Connecting to MongoDB database...");
  await mongoose.connect(uri);

  const email = "patelshruti0728@gmail.com";
  const existing = await UserModel.findOne({ email, isAdmin: true });

  if (existing) {
    existing.name = "Shruti Patel";
    existing.password = "admin123";
    await existing.save();
    console.log("✅ SUCCESS: Master Admin account updated successfully!");
    console.log("   Name:     Shruti Patel");
    console.log("   Email:    patelshruti0728@gmail.com");
    console.log("   Password: admin123");
  } else {
    const admin = new UserModel({
      name: "Shruti Patel",
      email: email,
      password: "admin123",
      isAdmin: true,
      profile: "/logo.png"
    });
    await admin.save();
    console.log("✅ SUCCESS: Master Admin account created successfully!");
    console.log("   Name:     Shruti Patel");
    console.log("   Email:    patelshruti0728@gmail.com");
    console.log("   Password: admin123");
  }

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("❌ ERROR creating admin:", err.message);
  process.exit(1);
});
