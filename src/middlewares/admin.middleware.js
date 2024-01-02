import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const adminValidation = asynchandler(async (req, res, next) => {
    const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
    );
    // console.log("decodedToken :: ", decodedToken);
    const user = await User.findById(decodedToken.id).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError(401, "Invaild Access Token");
    }
    if (user.role !== "admin") {
        throw new ApiError(401, "Unauthorized access");
    }
    req.user = user;
    next();
});

export { adminValidation };
