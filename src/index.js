import dotenv from "dotenv";
import connectDb from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `server is running at port : https://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.log("MONGO db connection failed!!!", error);
    });