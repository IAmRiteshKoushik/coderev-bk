import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { exit } from "node:process";
import dotenv from "dotenv"
import userRouter from "./routes/user.route";
import projectRouter from "./routes/project.route";

dotenv.config();
const app = express();

// Default Middlewares
app.use(cors({ credentials: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());          
app.use(express.urlencoded({ extended: false }));

// Route mapping
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

// Database mapping
const uri = process.env.MONGODB_URL;
console.log(uri);

// Initialize server
const PORT: number = 5000;
app.listen(PORT, () => {
    console.log(`Listening at PORT: ${PORT}`)
});

mongoose.Promise = Promise;
mongoose.connect(uri)
    .then(() => {
    })
    .catch((error: Error) => {
        console.error(error);
        exit(1);
});

