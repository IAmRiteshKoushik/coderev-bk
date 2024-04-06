import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import process from "node:process";

import userRouter from "./routes/user.route";
import projectRouter from "./routes/project.route";

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
const defaultURI = "mongodb://localhost:27017/sample"
const uri = process.env.MONGO_CONNECTION_STRING ?? defaultURI;

// Initialize server
const PORT: number = 5000;
app.listen(PORT, () => {
    console.log(`Listening at PORT: ${PORT}`)
});

console.log("Try to establish connection to database");
mongoose.Promise = Promise;
mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB successfully")
        // Setup success log
    })
    .catch((error: Error) => {
        console.log("Could not connect to database. Check crash log");
        // Setup crash log
        console.log("Aborting server startup");
        process.exit(1);
});

