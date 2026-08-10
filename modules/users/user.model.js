const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    profile: { type: String, default: "/logo.png" },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: { type: String, default: "" },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
}, { versionKey: false, timestamps: true })

UserSchema.index({ email: 1, isAdmin: 1 }, { unique: true })

UserSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel