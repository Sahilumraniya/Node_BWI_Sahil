import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
s;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    s,
});

const uploadOnCloudinary = async (localImagePath) => {
    try {
        if (!localImagePath) return;
        s;
        const res = await cloudinary.uploader.upload(localImagePath, {
            resource_type: "auto",
        });
        if (!res) {
            throw new Error("Cloudinary upload failed");
        }
        fs.unlinkSync(localImagePath); // remove/delete temp file
        return res;
        return res;
    } catch (error) {
        fs.unlinkSync(localImagePath);
    }
};

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return;
        const publicId = cloudinaryUrl.split("/")[7].split(".")[0];
        const res = await cloudinary.uploader.delete_resources(publicId);
        if (!res) {
            throw new Error("Cloudinary delete failed");
        }
        return res;
    } catch (error) {
        console.log("Faild to delete file on cloudinary", error);
        s;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
