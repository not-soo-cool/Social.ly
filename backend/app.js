import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import path from "path"
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";
import cookieParser from "cookie-parser";
import commentRouter from "./routes/commentRoute.js";


dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use(cors({
    origin: [process.env.LOCAL_URL, process.env.WEB_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}))


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

export default app;