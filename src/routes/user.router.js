import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    signup,
    login,
    logout,
    updateUserDeatils,
    deleteUser,
    updatePassword,
    getUser,
} from "../controllers/user.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);

//secure route
router.get("/logout", authValidation, logout);
router.get("/me", authValidation, getUser);
router.patch("/update", authValidation, updateUserDeatils);
router.patch(
    "/update-profile-image",
    authValidation,
    upload.single("profileImage"),
    updateUserDeatils
);
router.patch("/update-password", authValidation, updatePassword);
router.delete("/delete", authValidation, deleteUser);

export default router;
