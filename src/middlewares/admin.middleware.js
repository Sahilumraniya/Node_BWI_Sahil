import { User } from "../models/User.model";
import { ApiError } from "../utils/apiError";
import asynchandler from "../utils/asyncHandler";
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
    const user = await User.findById(decodedToken._id).select(
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
