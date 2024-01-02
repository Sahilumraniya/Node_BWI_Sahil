import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./apiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localImagePath) => {
    try {
        if (!localImagePath)
            throw new ApiError(500, "Local image path not provided");
        const res = await cloudinary.uploader.upload(localImagePath, {
            resource_type: "auto",
        });
        if (!res) {
            throw new Error("Cloudinary upload failed");
        }
        fs.unlinkSync(localImagePath); // remove/delete temp file
        return res;
    } catch (error) {
        fs.unlinkSync(localImagePath);
        console.log("Faild to upload file on cloudinary", error);
    }
};

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return;
        const publicId = cloudinaryUrl.split("/")[7].split(".")[0];
        const res = await cloudinary.api.delete_resources(publicId);
        if (!res) {
            throw new Error("Cloudinary delete failed");
        }
        return res;
    } catch (error) {
        console.log("Faild to delete file on cloudinary", error);
    }
};

const deleteAllFromCloudinary = async () => {
    try {
        const res = await cloudinary.api.delete_all_resources();
        if (!res) {
            throw new Error("Cloudinary delete failed");
        }
        return res;
    } catch (error) {
        console.log("Faild to delete file on cloudinary", error);
    }
};

export { uploadOnCloudinary, deleteFromCloudinary, deleteAllFromCloudinary };
