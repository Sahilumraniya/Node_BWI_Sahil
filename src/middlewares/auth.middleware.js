import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authValidation = asynchandler(async (req, res, next) => {
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
    // console.log("user :: ", user);

    if (!user) {
        throw new ApiError(401, "Middleware::Invaild Access Token");
    }
    req.user = user;
    next();
});

export { authValidation };
