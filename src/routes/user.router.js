import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { signup, login } from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);

export default router;
