import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespones.js";
import asynchandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllUsers = asynchandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(new ApiResponse(200, "success", users));
});

const updateUser = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const { username, role } = req.body;
    // check if required fields are provided
    if (username === undefined && role === undefined) {
        throw new ApiError(400, "Please provide username or role");
    }

    // check if user already exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.username = username || user.username;
    user.role = role || user.role;
    await user.save({ validateBeforeSave: true });
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: user.toJSON(),
            },
            "User updated successfully"
        )
    );
});

const updateProfileImage = asynchandler(async (req, res) => {
    const { userId } = req.params;
    // check if required fields are provided
    const profileImageLocalPath = req.file?.path;

    if (profileImageLocalPath === undefined) {
        throw new ApiError(400, "Please provide profile image");
    }

    // upload profile image on cloudinary
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    // check if user already exists
    const user = await User.findById(userId);

    user.profileImage = profileImage.url;
    await user.save({ validateBeforeSave: true });
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: user.toJSON(),
            },
            "User updated successfully"
        )
    );
});

const deleteUser = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    await user.remove();
    res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

const deleteAllUsers = asynchandler(async (req, res) => {
    await User.deleteMany();
    res.status(200).json(new ApiResponse(200, "Users deleted successfully"));
});

export {
    getAllUsers,
    updateUser,
    updateProfileImage,
    deleteUser,
    deleteAllUsers,
};
