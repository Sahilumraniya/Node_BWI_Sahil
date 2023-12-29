import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
app.use(cookieParser());

export default app;