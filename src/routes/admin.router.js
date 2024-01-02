import { Router } from "express";
import {
    getAllUsers,
    updateUser,
    updateProfileImage,
    deleteUser,
    deleteAllUsers,
} from "../controllers/admin.controller.js";
import { adminValidation } from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/getAllUser", adminValidation, getAllUsers);
router.post("/updateUser/:userId", adminValidation, updateUser);
router.post(
    "/updateProfileImage/:userId",
    adminValidation,
    upload.single("profileImage"),
    updateProfileImage
);
router.delete("/deleteUser/:userId", adminValidation, deleteUser);
router.delete("/deleteAllUsers", adminValidation, deleteAllUsers);

export default router;
