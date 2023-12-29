import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        default: "user",
    },
    refershToken: {
        type: String,
        required: false,
    },
    accessToken: {
        type: String,
        required: false,
    },
});

export default mongoose.model("User", UserSchema);
