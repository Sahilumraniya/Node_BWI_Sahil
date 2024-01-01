import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespones.js";
import asynchandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

export { signup, login };
