import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

import testRouter from "./routes/test.route";
import userRouter from "./routes/user.route";
import projectRouter from "./routes/project.route";

const app = express();

// Default Middlewares
app.use(cors({ credentials: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());          

// Route mapping
app.use("/api/test", testRouter);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

// Database mapping
const defaultURI = "mongodb://localhost:27017/sample"
const uri = process.env.MONGO_CONNECTION_STRING ?? defaultURI;
const options = {
    poolSize: 25,
    useUnifiedTopology: true,        // Compatibile with lastest MongoDB server version and drivers
    serverSelectionTimeoutMS: 10000, // 10 seconds idle connection timeout
}

// Port mapping
const PORT: number = 5000;

async function connectMongo(): Promise<void> {
    try {
        await mongoose.connect(uri, options);
        console.log("Database connection established successfully!")
        // Setup successful connection log
    } catch (error){
        // Setup crash log
        process.exit(1);
    }
}

async function startServer(): Promise<void> {
    try {
        await connectMongo();
        app.listen(PORT, () => {
            console.log(`Listening at PORT: ${PORT}`)
            // Setup successful initialization log
        });
        // Setup crash log
    } catch (error){
        // Setup crash log 
        process.exit(1);
    }
}

startServer();
