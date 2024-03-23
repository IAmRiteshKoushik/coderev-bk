import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";

import testRouter from "./routes/test.route";
import userRouter from "./routes/user.route";
import reviewRouter from "./routes/review.route";
import historyRouter from "./routes/history.route";

const app = express();

// Default Middlewares
app.use(cors({
    credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(helmet());          // Default config for time being

// Route mapping
app.use("/api/v1/test", testRouter);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("api/v1/history", historyRouter);

// Port mapping
const PORT: number = 5000;
app.listen(PORT, () => console.log(`Listening at PORT: ${PORT}`));

// Database mapping
