import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.router.js";

const app = express();

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
app.use(cookieParser());

app.use("/api/v1/user", userRouter);

export default app;
