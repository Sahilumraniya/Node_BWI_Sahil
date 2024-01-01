import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
    {
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
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    delete user.refreshToken;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
};

UserSchema.methods.generateRefreshToken = function () {
    const user = this;
    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
    return refreshToken;
};

UserSchema.methods.generateAccessToken = function () {
    const user = this;
    const accessToken = jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            usernaame: user.username,
            phoneNumber: user.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
    return accessToken;
};

export const User = mongoose.model("User", UserSchema);
