import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespones.js";
import asynchandler from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";

const generateAccessAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        // validateBeforeSave is used to skip validate the user model before saving
        await user.save({ validateBeforeSave: true });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Something went wrong while generathing tokens", error);
        throw new ApiError(
            500,
            "something went wrong while generathing tokens"
        );
    }
};

const signup = asynchandler(async (req, res) => {
    const { username, phoneNumber, email, password, role = "user" } = req.body;

    // check if required fields are provided
    if (
        [username, phoneNumber, email, password, role].includes(
            undefined || null || ""
        )
    ) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // check if user already exists
    const isUserExists = await User.findOne({
        $or: [{ email }, { phoneNumber }],
    });

    if (isUserExists) {
        throw new ApiError(400, "User already exists");
    }
    const profileImageLocalPath = req.file?.path;
    if (!profileImageLocalPath) {
        throw new ApiError(400, "Please provide profile image");
    }
    // upload profile image on cloudinary
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    // create user
    const user = await User.create({
        username,
        phoneNumber,
        email,
        password,
        profileImage: profileImage.url,
        role,
    });
    const resUser = user.toJSON();
    console.log("resUser", resUser);
    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
        user._id
    );
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    // set cookies
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
    });
    // send response
    res.status(201).json(
        new ApiResponse(
            201,
            {
                user: resUser,
                accessToken,
                refreshToken,
            },
            "User created successfully"
        )
    );
});

const login = asynchandler(async (req, res) => {
    // Allow users to log in using email/phone and password.
    // check if required fields are provided
    const { phoneNumber, email, password } = req.body;
    if (phoneNumber === undefined && email === undefined) {
        throw new ApiError(400, "Please provide email or phone number");
    }
    if (password === undefined) {
        throw new ApiError(400, "Please provide password");
    }
    // check if user exists
    const isUserExists = await User.findOne({
        $or: [{ email }, { phoneNumber }],
    });
    if (!isUserExists) {
        throw new ApiError(400, "User does not exists");
    }
    // compare password
    const isPasswordMatched = await isUserExists.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(400, "Password is incorrect");
    }
    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
        isUserExists._id
    );
    // set cookies
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
    });
    // send response
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: isUserExists.toJSON(),
                accessToken,
                refreshToken,
            },
            "User logged in successfully"
        )
    );
});

const logout = asynchandler(async (req, res) => {
    const user = req.user;
    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true, // to get updated value of user
        }
    );

    const cookieOption = {
        httpOnly: true,
        secure: true,
    };

    res.status(200)
        .clearCookie("accessToken", cookieOption)
        .clearCookie("refreshToken", cookieOption)
        .json(new ApiResponse(200, {}, "user logged out"));
});

const updateUserDeatils = asynchandler(async (req, res) => {
    const { username, role } = req.body;
    const { email, phoneNumber } = req.user;
    // check if required fields are provided
    if (username === undefined && role === undefined) {
        throw new ApiError(400, "Please provide username or role");
    }

    // check if user already exists
    const user = await User.findOne({
        $or: [{ email }, { phoneNumber }],
    });
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
    const { email, phoneNumber } = req.user;
    // check if required fields are provided
    const profileImageLocalPath = req.file?.path;

    if (profileImageLocalPath === undefined) {
        throw new ApiError(400, "Please provide profile image");
    }

    // upload profile image on cloudinary
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    await deleteFromCloudinary(req.user.profileImage);

    // check if user already exists
    const user = await User.findOne({
        $or: [{ email }, { phoneNumber }],
    });

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
    const { email, phoneNumber, profileImage } = req.user;

    if (!email && !phoneNumber) {
        throw new ApiError(400, "Please provide email or phone number");
    }
    await deleteFromCloudinary(profileImage);
    User.findOneAndDelete({ $or: [{ email }, { phoneNumber }] })
        .then((user) => {
            if (!user) {
                throw new ApiError(400, "User does not exists");
            }
            //clear cookies
            const cookieOption = {
                httpOnly: true,
                secure: true,
            };
            res.cookie.clearCookie("accessToken", cookieOption);
            res.cookie.clearCookie("refreshToken", cookieOption);
            res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        user: user.toJSON(),
                    },
                    "User deleted successfully"
                )
            );
        })
        .catch((error) => {
            console.log("error", error);
            throw new ApiError(500, "Something went wrong");
        });
});

const updatePassword = asynchandler(async (req, res) => {
    const { email, phoneNumber } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!email && !phoneNumber) {
        throw new ApiError(400, "Please provide email or phone number");
    }

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Please provide old password and new password");
    }

    const user = await User.findOne({
        $or: [{ email }, { phoneNumber }],
    });

    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        throw new ApiError(400, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: user.toJSON(),
            },
            "Password updated successfully"
        )
    );
});

const getUser = asynchandler(async (req, res) => {
    const { user } = req;
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: user.toJSON(),
            },
            "User fetched successfully"
        )
    );
});

export {
    signup,
    login,
    logout,
    updateUserDeatils,
    updateProfileImage,
    deleteUser,
    updatePassword,
    getUser,
};
